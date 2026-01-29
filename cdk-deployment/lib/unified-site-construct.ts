/**
 * UnifiedSiteConstruct - CDK construct for unified multi-site deployment
 * 
 * This construct creates a single CloudFront distribution with a single S3 bucket
 * containing all sites in separate directories. Much simpler than multiple buckets!
 * 
 * Benefits:
 * - Single S3 bucket for all sites
 * - Simple directory structure (docs/, demo/, examples/)
 * - Single CloudFront origin - no complex cache behaviors needed
 * - Easier to manage and debug
 * 
 * Architecture:
 * - Single S3 bucket with directory structure:
 *   - /docs/ → API Documentation
 *   - /demo/ → Demo Site  
 *   - /examples/ → Example Projects
 * - Single CloudFront distribution with one origin
 * - Simple path-based routing (no CloudFront Functions needed)
 * 
 * Validates Requirements: 1.1, 1.2, 2.1, 2.2, 2.3
 */

import { Construct } from 'constructs';
import { RemovalPolicy, Duration, Size, Aws } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
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
 * from a single S3 bucket with directory structure and a single CloudFront distribution.
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
 *       targetDir: 'docs'
 *     },
 *     {
 *       siteName: 'demo',
 *       sourceDir: 'demo/dist/',
 *       pathPattern: '/demo/*',
 *       targetDir: 'demo'
 *     }
 *   ]
 * });
 * ```
 */
export class UnifiedSiteConstruct extends Construct {
  /**
   * The single S3 bucket containing all sites
   */
  public readonly bucket: s3.Bucket;
  
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
    
    // Initialize deployments map
    this.deployments = new Map<string, s3deploy.BucketDeployment>();
    
    // Store domain name
    this.domainName = props.domainName;
    
    // Create S3 bucket for CloudFront logs if logging is enabled
    if (props.enableLogging !== false) {
      this.logBucket = this.createLogBucket();
    }
    
    // Create single S3 bucket for all sites
    this.bucket = this.createMainBucket();
    
    // Create CloudFront distribution with single origin
    this.distribution = this.createCloudFrontDistribution(props);
    
    // Add S3 bucket policy to allow CloudFront access
    this.addCloudFrontBucketPolicy();
    
    // Set distribution URL
    this.distributionUrl = `https://${this.distribution.distributionDomainName}`;
    
    // Create Route53 records if enabled
    if (props.createRoute53Records !== false) {
      this.route53Record = this.createRoute53Records(props);
    }
    
    // Create bucket deployments for each site to different directories
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
   * Creates the main S3 bucket for all sites with proper security configuration
   * 
   * The bucket is configured with:
   * - Block public access enabled (all four settings)
   * - Server-side encryption (AES256)
   * - Lifecycle policies for cost optimization
   * - Appropriate removal policy
   * 
   * Directory structure:
   * - /docs/ → API Documentation
   * - /demo/ → Demo Site
   * - /examples/ → Example Projects
   * 
   * Validates Requirements: 1.1, 5.1, 5.2, 5.5
   * 
   * @returns The created S3 bucket
   */
  private createMainBucket(): s3.Bucket {
    // Create S3 bucket with security configuration
    const bucket = new s3.Bucket(this, 'MainBucket', {
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
    
    return bucket;
  }
  
  /**
   * Creates CloudFront distribution with single S3 origin
   * 
   * The distribution is configured with:
   * - Single S3 origin with Origin Access Control
   * - Simple path-based routing (no CloudFront Functions needed!)
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
    
    // Create single S3 origin
    const origin = origins.S3BucketOrigin.withOriginAccessControl(this.bucket, {
      originAccessControl: oac,
    });
    
    console.log(`🌐 Creating CloudFront distribution with single origin`);
    console.log(`📁 S3 bucket: ${this.bucket.bucketName}`);
    console.log(`🔗 Domain: ${props.domainName}`);
    
    // Create the CloudFront distribution with simple configuration
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      // Single default behavior - no complex cache behaviors needed!
      defaultBehavior: {
        origin: origin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        compress: true,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        // No CloudFront Functions needed - S3 handles the directory structure!
      },
      
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
   * Adds S3 bucket policy to allow CloudFront Origin Access Control (OAC) access
   * 
   * This method adds the necessary IAM policy statement to the S3 bucket to allow
   * CloudFront to access objects using Origin Access Control. The policy grants:
   * - s3:GetObject permission for all objects in the bucket
   * - s3:ListBucket permission for directory listing (404 vs 403 responses)
   * 
   * The policy is restricted to the specific CloudFront distribution using the
   * AWS:SourceArn condition.
   * 
   * @private
   */
  private addCloudFrontBucketPolicy(): void {
    console.log(`🔐 Adding S3 bucket policy for CloudFront OAC access`);
    
    // Add s3:GetObject permission for CloudFront to access all objects
    this.bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['s3:GetObject'],
        principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
        resources: [this.bucket.arnForObjects('*')],
        conditions: {
          StringEquals: {
            'AWS:SourceArn': `arn:${Aws.PARTITION}:cloudfront::${Aws.ACCOUNT_ID}:distribution/${this.distribution.distributionId}`
          }
        }
      })
    );
    
    // Add s3:ListBucket permission for better error handling (404 vs 403)
    this.bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['s3:ListBucket'],
        principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
        resources: [this.bucket.bucketArn],
        conditions: {
          StringEquals: {
            'AWS:SourceArn': `arn:${Aws.PARTITION}:cloudfront::${Aws.ACCOUNT_ID}:distribution/${this.distribution.distributionId}`
          }
        }
      })
    );
    
    console.log(`✅ S3 bucket policy added for distribution ${this.distribution.distributionId}`);
  }
  
  /**
   * Creates bucket deployments for each site to different directories in the single bucket
   * 
   * Each deployment:
   * - Uploads files from the source directory to a specific directory in the S3 bucket
   * - Creates a CloudFront invalidation for the specific path after deployment
   * - Waits for invalidation completion before reporting success
   * - Ensures content updates are immediately visible to users
   * 
   * Directory structure:
   * - docs/ → API Documentation (from docs/api/)
   * - demo/ → Demo Site (from demo/dist/)
   * - examples/ → Example Projects (from examples/genesis-ai/dist/)
   * 
   * Validates Requirements: 3.5, 7.1, 7.2, 7.5
   * 
   * @param sites - Array of site configurations
   */
  private createBucketDeployments(sites: SiteOriginConfig[]): void {
    console.log(`📦 Creating bucket deployments for ${sites.length} sites:`);
    
    for (const site of sites) {
      // Determine the target directory in the bucket
      // For /docs/* pattern, we want to deploy to docs/ directory
      const targetDir = site.pathPattern.replace('/*', '').replace('/', '');
      
      console.log(`  - ${site.siteName}: ${site.sourceDir} → s3://${this.bucket.bucketName}/${targetDir}/`);
      
      // Create bucket deployment to specific directory
      const deployment = new s3deploy.BucketDeployment(this, `${site.siteName}-deployment`, {
        // Source directory containing build artifacts
        sources: [s3deploy.Source.asset(site.sourceDir)],
        
        // Destination S3 bucket and directory
        destinationBucket: this.bucket,
        destinationKeyPrefix: targetDir + '/',
        
        // CloudFront distribution to invalidate
        distribution: this.distribution,
        
        // Invalidation paths - invalidate only this site's path
        distributionPaths: [site.pathPattern],
        
        // Wait for CloudFront invalidation to complete before reporting success
        waitForDistributionInvalidation: true,
        
        // Prune - remove files from this directory that are not in the source
        // This ensures the directory exactly matches the source directory
        prune: true,
        
        // Memory size for the Lambda function that performs the deployment
        memoryLimit: 256,
        
        // Ephemeral storage size for the Lambda function
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
