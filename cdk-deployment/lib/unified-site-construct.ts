/**
 * UnifiedSiteConstruct - CDK construct for unified multi-site deployment
 * 
 * This construct creates a single CloudFront distribution with multiple S3 origins
 * for path-based routing. All sites are served under a single domain with different
 * path patterns (e.g., /docs/*, /demo/*, /examples/*).
 * 
 * Benefits:
 * - Single domain for all related sites
 * - Lower cost (one CloudFront distribution vs multiple)
 * - Simpler DNS configuration
 * - Easier SSL certificate management
 * 
 * Architecture:
 * - Multiple S3 buckets (one per site)
 * - Single CloudFront distribution
 * - Path-based cache behaviors for routing
 * - CloudFront Functions for path rewriting
 * 
 * Validates Requirements: 1.1, 1.2, 2.1, 2.2, 2.3
 */

import { Construct } from 'constructs';
import { RemovalPolicy, Duration, Size } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { SiteOriginConfig } from './config-types';

/**
 * Properties for UnifiedSiteConstruct
 */
export interface UnifiedSiteProps {
  /** Primary domain for all sites */
  domainName: string;
  
  /** ACM certificate ARN for the domain (must be in us-east-1 for CloudFront) */
  certificateArn: string;
  
  /** Array of site configurations */
  sites: SiteOriginConfig[];
  
  /** CloudFront price class (optional, defaults to PRICE_CLASS_100) */
  priceClass?: cloudfront.PriceClass;
  
  /** Enable CloudFront access logs (optional, defaults to true) */
  enableLogging?: boolean;
  
  /** Default root object (optional, defaults to index.html) */
  defaultRootObject?: string;
  
  /** Whether to use selective invalidation (default: false) */
  useSelectiveInvalidation?: boolean;
  
  /** Maximum paths for selective invalidation (default: 1000) */
  maxInvalidationPaths?: number;
  
  /** Whether to create Route53 records automatically (default: true) */
  createRoute53Records?: boolean;
  
  /** Route53 hosted zone ID (optional, will be looked up if not provided) */
  hostedZoneId?: string;
}

/**
 * UnifiedSiteConstruct - Creates infrastructure for multiple sites under a single domain
 * 
 * This construct implements the unified deployment pattern where all sites are served
 * from a single CloudFront distribution using path-based routing.
 * 
 * Example usage:
 * ```typescript
 * const unifiedSite = new UnifiedSiteConstruct(this, 'UnifiedSite', {
 *   domainName: 'example.com',
 *   certificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/...',
 *   sites: [
 *     {
 *       siteName: 'api-docs',
 *       sourceDir: 'docs/api/',
 *       pathPattern: '/docs/*',
 *       pathRewrite: '/docs'
 *     },
 *     {
 *       siteName: 'demo',
 *       sourceDir: 'demo/dist/',
 *       pathPattern: '/demo/*',
 *       pathRewrite: '/demo'
 *     }
 *   ]
 * });
 * ```
 */
export class UnifiedSiteConstruct extends Construct {
  /**
   * Map of S3 buckets for each site (keyed by site name)
   */
  public readonly buckets: Map<string, s3.Bucket>;
  
  /**
   * Map of bucket deployments for each site (keyed by site name)
   */
  public readonly deployments: Map<string, s3deploy.BucketDeployment>;
  
  /**
   * The CloudFront distribution serving all sites
   */
  public readonly distribution: cloudfront.Distribution;
  
  /**
   * The CloudFront distribution URL
   */
  public readonly distributionUrl: string;
  
  /**
   * The custom domain name
   */
  public readonly domainName: string;
  
  /**
   * The S3 bucket for CloudFront access logs (if logging is enabled)
   */
  public readonly logBucket?: s3.Bucket;
  
  /**
   * The Route53 A record for the custom domain (if created)
   */
  public readonly route53Record?: route53.ARecord;
  
  /**
   * Creates a new UnifiedSiteConstruct
   * 
   * @param scope - The parent construct
   * @param id - The construct ID
   * @param props - Configuration properties
   */
  constructor(scope: Construct, id: string, props: UnifiedSiteProps) {
    super(scope, id);
    
    // Validate props
    this.validateProps(props);
    
    // Initialize buckets map
    this.buckets = new Map<string, s3.Bucket>();
    
    // Initialize deployments map
    this.deployments = new Map<string, s3deploy.BucketDeployment>();
    
    // Store domain name
    this.domainName = props.domainName;
    
    // Create S3 bucket for CloudFront logs if logging is enabled
    if (props.enableLogging !== false) {
      this.logBucket = this.createLogBucket();
    }
    
    // Create S3 buckets for each site
    this.createS3Buckets(props.sites);
    
    // Create CloudFront distribution with multiple origins
    this.distribution = this.createCloudFrontDistribution(props);
    
    // Set distribution URL
    this.distributionUrl = `https://${this.distribution.distributionDomainName}`;
    
    // Create Route53 records if enabled
    if (props.createRoute53Records !== false) {
      this.route53Record = this.createRoute53Records(props);
    }
    
    // Create bucket deployments for each site with automatic invalidation
    this.createBucketDeployments(props.sites);
  }
  
  /**
   * Creates S3 bucket for CloudFront access logs
   * 
   * The log bucket is configured with:
   * - Block public access enabled
   * - Server-side encryption (AES256)
   * - ACLs enabled (required for CloudFront logging as of April 2023)
   * - Lifecycle policy to delete logs after 30 days
   * - Appropriate removal policy
   * 
   * CloudFront requires ACL access to grant FULL_CONTROL permission to the
   * awslogsdelivery account (canonical ID: c4c1ede66af53448b93c283ce9448c4ba468c9432aa01d700d3878632f77d2d0)
   * 
   * Validates Requirements: 9.4
   * 
   * @returns The created S3 bucket for logs
   */
  private createLogBucket(): s3.Bucket {
    const logBucket = new s3.Bucket(this, 'LogBucket', {
      // Block all public access
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      
      // Enable server-side encryption with AES256
      encryption: s3.BucketEncryption.S3_MANAGED,
      
      // Disable versioning (not needed for logs)
      versioned: false,
      
      // Enforce SSL/TLS for all requests
      enforceSSL: true,
      
      // Enable ACLs for CloudFront logging (required as of April 2023)
      // CloudFront needs to grant FULL_CONTROL to awslogsdelivery account
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,
      
      // Lifecycle rule to delete logs after 30 days
      lifecycleRules: [
        {
          id: 'DeleteOldLogs',
          enabled: true,
          expiration: Duration.days(30),
          abortIncompleteMultipartUploadAfter: Duration.days(7),
        },
      ],
      
      // Removal policy: DESTROY for log buckets (safe to delete)
      removalPolicy: RemovalPolicy.DESTROY,
      
      // Auto-delete objects when stack is destroyed
      autoDeleteObjects: true,
    });
    
    return logBucket;
  }
  
  /**
   * Creates S3 buckets for each site with proper security configuration
   * 
   * Each bucket is configured with:
   * - Block public access enabled (all four settings)
   * - Server-side encryption (AES256)
   * - Lifecycle policies for cost optimization
   * - Appropriate removal policy
   * 
   * Validates Requirements: 1.1, 5.1, 5.2, 5.5
   * 
   * @param sites - Array of site configurations
   */
  private createS3Buckets(sites: SiteOriginConfig[]): void {
    for (const site of sites) {
      // Create S3 bucket with security configuration
      const bucket = new s3.Bucket(this, `${site.siteName}-bucket`, {
        // Block all public access - content served exclusively through CloudFront
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        
        // Enable server-side encryption with AES256
        encryption: s3.BucketEncryption.S3_MANAGED,
        
        // Disable versioning (not needed for static sites)
        versioned: false,
        
        // Enforce SSL/TLS for all requests
        enforceSSL: true,
        
        // Lifecycle rules for cost optimization
        lifecycleRules: [
          {
            // Transition to Infrequent Access after 90 days
            transitions: [
              {
                storageClass: s3.StorageClass.INFREQUENT_ACCESS,
                transitionAfter: Duration.days(90),
              },
            ],
            // Abort incomplete multipart uploads after 7 days
            abortIncompleteMultipartUploadAfter: Duration.days(7),
          },
        ],
        
        // Removal policy: DESTROY to allow clean stack deletion
        removalPolicy: RemovalPolicy.DESTROY,
        
        // Auto-delete objects when stack is destroyed
        autoDeleteObjects: true,
      });
      
      // Store bucket in map for later reference
      this.buckets.set(site.siteName, bucket);
    }
  }
  
  /**
   * Creates a CloudFront Function for path rewriting
   * 
   * The function strips the path prefix before forwarding requests to S3.
   * For example, /docs/index.html becomes /index.html for the S3 origin.
   * Also handles default document (index.html) for directory requests.
   * 
   * Validates Requirements: 1.5
   * 
   * @param site - Site configuration
   * @returns The created CloudFront Function
   */
  private createPathRewriteFunction(site: SiteOriginConfig): cloudfront.Function {
    // Determine the path prefix to strip
    const pathPrefix = site.pathRewrite || site.pathPattern.replace('/*', '');
    
    // Create the function code
    const functionCode = `function handler(event) {
  var request = event.request;
  var uri = request.uri;
  
  // Remove path prefix for S3 origin
  if (uri.startsWith('${pathPrefix}/')) {
    request.uri = uri.substring(${pathPrefix.length});
  } else if (uri === '${pathPrefix}') {
    request.uri = '/index.html';
  }
  
  // Ensure URI starts with /
  if (!request.uri.startsWith('/')) {
    request.uri = '/' + request.uri;
  }
  
  // Default to index.html for directory requests
  if (request.uri.endsWith('/')) {
    request.uri += 'index.html';
  } else if (!request.uri.includes('.')) {
    // If no file extension, assume it's a directory
    request.uri += '/index.html';
  }
  
  return request;
}`;
    
    // Create CloudFront Function
    const cfFunction = new cloudfront.Function(this, `${site.siteName}-path-rewrite`, {
      code: cloudfront.FunctionCode.fromInline(functionCode),
      comment: `Path rewrite function for ${site.siteName}`,
      functionName: `${site.siteName}-path-rewrite-${this.node.addr.substring(0, 8)}`,
    });
    
    return cfFunction;
  }
  
  /**
   * Creates CloudFront distribution with multiple S3 origins
   * 
   * The distribution is configured with:
   * - Multiple S3 origins (one per site) with Origin Access Control
   * - Path-based cache behaviors for routing requests to correct origins
   * - CloudFront Functions for path rewriting
   * - Custom domain name and SSL certificate
   * - HTTPS enforcement (redirect HTTP to HTTPS)
   * - Compression enabled for cost optimization
   * - Custom error responses for SPA routing support
   * - Appropriate cache TTLs
   * 
   * Validates Requirements: 1.2, 1.3, 1.5, 5.3, 5.4
   * 
   * @param props - Configuration properties
   * @returns The created CloudFront distribution
   */
  private createCloudFrontDistribution(props: UnifiedSiteProps): cloudfront.Distribution {
    // Create Origin Access Control for secure S3 access
    const oac = new cloudfront.S3OriginAccessControl(this, 'OAC', {
      signing: cloudfront.Signing.SIGV4_NO_OVERRIDE,
    });
    
    // Create origins map for each site
    const siteOrigins = new Map<string, cloudfront.IOrigin>();
    
    for (const site of props.sites) {
      const bucket = this.buckets.get(site.siteName);
      if (!bucket) {
        throw new Error(`Bucket not found for site: ${site.siteName}`);
      }
      
      // Create S3 origin with Origin Access Control
      const origin = origins.S3BucketOrigin.withOriginAccessControl(bucket, {
        originAccessControl: oac,
      });
      
      siteOrigins.set(site.siteName, origin);
    }
    
    // Create path rewrite function for each site
    const sitePathFunctions = new Map<string, cloudfront.Function>();
    
    for (const site of props.sites) {
      const pathRewriteFunction = this.createPathRewriteFunction(site);
      sitePathFunctions.set(site.siteName, pathRewriteFunction);
    }
    
    // Create cache behaviors for ALL sites with specific path patterns
    const additionalBehaviors: Record<string, cloudfront.BehaviorOptions> = {};
    
    console.log(`🔀 Creating cache behaviors for ${props.sites.length} sites:`);
    
    for (const site of props.sites) {
      const origin = siteOrigins.get(site.siteName);
      const pathFunction = sitePathFunctions.get(site.siteName);
      
      if (!origin) {
        throw new Error(`Origin not found for site: ${site.siteName}`);
      }
      
      if (!pathFunction) {
        throw new Error(`Path function not found for site: ${site.siteName}`);
      }
      
      console.log(`  - ${site.pathPattern} → ${site.siteName} (${site.sourceDir})`);
      
      // Create cache behavior for this path pattern
      additionalBehaviors[site.pathPattern] = {
        origin: origin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        compress: true,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        functionAssociations: [
          {
            function: pathFunction,
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          },
        ],
      };
      
      // Also add patterns without trailing /* to catch edge cases
      const basePattern = site.pathPattern.replace('/*', '');
      if (basePattern !== site.pathPattern) {
        additionalBehaviors[basePattern] = {
          origin: origin,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
          compress: true,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          functionAssociations: [
            {
              function: pathFunction,
              eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
            },
          ],
        };
        console.log(`  - ${basePattern} → ${site.siteName} (edge case)`);
      }
    }
    
    // Use the first site as the default origin, but this should rarely be hit
    // Most requests should match the specific cache behaviors above
    const firstSite = props.sites[0];
    const defaultOrigin = siteOrigins.get(firstSite.siteName);
    const defaultFunction = sitePathFunctions.get(firstSite.siteName);
    
    if (!defaultOrigin) {
      throw new Error(`Default origin not found for site: ${firstSite.siteName}`);
    }
    
    if (!defaultFunction) {
      throw new Error(`Default function not found for site: ${firstSite.siteName}`);
    }
    
    console.log(`🏠 Default behavior → ${firstSite.siteName} (fallback only)`);
    
    // Create the CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      // Default behavior (for the first site's path pattern)
      defaultBehavior: {
        origin: defaultOrigin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        compress: true,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        functionAssociations: [
          {
            function: defaultFunction,
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          },
        ],
      },
      
      // Additional behaviors for other sites
      additionalBehaviors: additionalBehaviors,
      
      // Custom domain configuration
      domainNames: [props.domainName],
      
      // SSL certificate (must be in us-east-1 for CloudFront)
      certificate: acm.Certificate.fromCertificateArn(
        this,
        'Certificate',
        props.certificateArn
      ),
      
      // Default root object
      defaultRootObject: props.defaultRootObject || 'index.html',
      
      // Price class for cost optimization
      priceClass: props.priceClass || cloudfront.PriceClass.PRICE_CLASS_100,
      
      // Enable HTTP/2 and HTTP/3
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      
      // Custom error responses for SPA routing
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: Duration.minutes(5),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: Duration.minutes(5),
        },
      ],
      
      // Enable logging if specified
      enableLogging: props.enableLogging !== false,
      
      // Log bucket for access logs (if logging is enabled)
      logBucket: this.logBucket,
      
      // Log file prefix for organization
      logFilePrefix: 'cloudfront-logs/',
      
      // Include cookies in logs (optional, set to false for privacy)
      logIncludesCookies: false,
      
      // Comment for identification
      comment: `Unified distribution for ${props.domainName}`,
    });
    
    return distribution;
  }
  
  /**
   * Creates bucket deployments for each site with automatic CloudFront invalidation
   * 
   * Each deployment:
   * - Uploads files from the source directory to the S3 bucket
   * - Creates a CloudFront invalidation for all paths (/*) after deployment
   * - Waits for invalidation completion before reporting success
   * - Ensures content updates are immediately visible to users
   * - Supports selective invalidation to optimize cache invalidation
   * 
   * Validates Requirements: 3.5, 7.1, 7.2, 7.5
   * 
   * @param sites - Array of site configurations
   */
  private createBucketDeployments(sites: SiteOriginConfig[]): void {
    for (const site of sites) {
      const bucket = this.buckets.get(site.siteName);
      
      if (!bucket) {
        throw new Error(`Bucket not found for site: ${site.siteName}`);
      }
      
      // Create bucket deployment with automatic CloudFront invalidation
      const deployment = new s3deploy.BucketDeployment(this, `${site.siteName}-deployment`, {
        // Source directory containing build artifacts
        sources: [s3deploy.Source.asset(site.sourceDir)],
        
        // Destination S3 bucket
        destinationBucket: bucket,
        
        // CloudFront distribution to invalidate
        distribution: this.distribution,
        
        // Invalidation paths - invalidate all paths for this site
        // Using /* ensures all content is refreshed after deployment
        // Requirement 7.1: Create invalidation for all paths
        // Requirement 7.5: Selective invalidation can be implemented by using
        // SelectiveBucketDeployment construct instead
        distributionPaths: ['/*'],
        
        // Wait for CloudFront invalidation to complete before reporting success
        // This ensures users see updated content immediately after deployment completes
        // Requirement 7.2: Wait for invalidation completion
        waitForDistributionInvalidation: true,
        
        // Prune - remove files from bucket that are not in the source
        // This ensures the bucket exactly matches the source directory
        prune: true,
        
        // Memory size for the Lambda function that performs the deployment
        // 256 MB is sufficient for most static site deployments
        memoryLimit: 256,
        
        // Ephemeral storage size for the Lambda function
        // 512 MB provides adequate space for temporary file operations
        ephemeralStorageSize: Size.mebibytes(512),
      });
      
      // Store deployment in map for later reference
      this.deployments.set(site.siteName, deployment);
    }
  }
  
  /**
   * Creates Route53 A record pointing to the CloudFront distribution
   * 
   * This method automatically creates an A record (alias) that points the custom domain
   * to the CloudFront distribution. It will look up the hosted zone by domain name
   * if hostedZoneId is not provided.
   * 
   * @param props - Configuration properties
   * @returns The created Route53 A record
   */
  private createRoute53Records(props: UnifiedSiteProps): route53.ARecord {
    // Look up the hosted zone for the domain
    const hostedZone = props.hostedZoneId
      ? route53.HostedZone.fromHostedZoneId(this, 'HostedZone', props.hostedZoneId)
      : route53.HostedZone.fromLookup(this, 'HostedZone', {
          domainName: props.domainName,
        });
    
    // Create A record (alias) pointing to CloudFront distribution
    const aRecord = new route53.ARecord(this, 'AliasRecord', {
      zone: hostedZone,
      recordName: props.domainName,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(this.distribution)
      ),
      comment: `A record for ${props.domainName} pointing to CloudFront distribution`,
    });
    
    return aRecord;
  }
  
  /**
   * Validates the construct properties
   * 
   * @param props - Properties to validate
   * @throws Error if validation fails
   */
  private validateProps(props: UnifiedSiteProps): void {
    // Validate domain name
    if (!props.domainName || props.domainName.trim().length === 0) {
      throw new Error('domainName is required and cannot be empty');
    }
    
    // Validate certificate ARN
    if (!props.certificateArn || props.certificateArn.trim().length === 0) {
      throw new Error('certificateArn is required and cannot be empty');
    }
    
    // Validate certificate is in us-east-1 (required for CloudFront)
    if (!props.certificateArn.includes(':us-east-1:')) {
      throw new Error('Certificate must be in us-east-1 region for CloudFront. ' +
        'Current ARN: ' + props.certificateArn);
    }
    
    // Validate sites array
    if (!props.sites || props.sites.length === 0) {
      throw new Error('At least one site configuration is required');
    }
    
    // Validate each site configuration
    const siteNames = new Set<string>();
    const pathPatterns = new Set<string>();
    
    for (const site of props.sites) {
      // Check for required fields
      if (!site.siteName || site.siteName.trim().length === 0) {
        throw new Error('siteName is required for all sites');
      }
      
      if (!site.sourceDir || site.sourceDir.trim().length === 0) {
        throw new Error(`sourceDir is required for site: ${site.siteName}`);
      }
      
      if (!site.pathPattern || site.pathPattern.trim().length === 0) {
        throw new Error(`pathPattern is required for site: ${site.siteName}`);
      }
      
      // Check for duplicate site names
      if (siteNames.has(site.siteName)) {
        throw new Error(`Duplicate site name: ${site.siteName}`);
      }
      siteNames.add(site.siteName);
      
      // Check for duplicate path patterns
      if (pathPatterns.has(site.pathPattern)) {
        throw new Error(`Duplicate path pattern: ${site.pathPattern}`);
      }
      pathPatterns.add(site.pathPattern);
      
      // Validate path pattern format
      if (!site.pathPattern.startsWith('/')) {
        throw new Error(`Path pattern must start with /: ${site.pathPattern}`);
      }
      
      // Validate path rewrite if provided
      if (site.pathRewrite !== undefined) {
        if (!site.pathRewrite.startsWith('/')) {
          throw new Error(`Path rewrite must start with /: ${site.pathRewrite} for site: ${site.siteName}`);
        }
      }
    }
  }
}
