/**
 * DeploymentStack - Main CDK stack for multi-site deployment
 * 
 * This stack orchestrates the deployment of static websites using the unified
 * deployment pattern: Single CloudFront distribution with path-based routing.
 * 
 * All sites are served from a single domain with different path patterns:
 * - /docs/* → API Documentation
 * - /demo/* → Demo Site
 * - /examples/* → Example Projects
 * 
 * Validates Requirements: 6.1, 8.1
 */

import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from 'constructs';
import { ConfigurationManager } from './configuration-manager';
import { DeploymentConfig, SiteOriginConfig } from './config-types';
import { UnifiedSiteConstruct } from './unified-site-construct';

/**
 * Properties for DeploymentStack
 * 
 * The stack can be configured in two ways:
 * 1. Pass a complete DeploymentConfig object
 * 2. Let the stack load configuration from CDK context
 */
export interface DeploymentStackProps extends StackProps {
  /**
   * Optional pre-loaded configuration
   * If not provided, configuration will be loaded from CDK context
   */
  config?: DeploymentConfig;
}

/**
 * DeploymentStack - Main CDK stack that orchestrates deployment
 * 
 * This stack uses the unified deployment pattern:
 * - Single CloudFront distribution with multiple S3 origins
 * - Path-based routing (e.g., /docs/*, /demo/*, /examples/*)
 * - Lower cost, simpler DNS configuration
 * - All sites under one domain
 * 
 * Example usage:
 * ```typescript
 * const app = new cdk.App();
 * const stack = new DeploymentStack(app, 'DeploymentStack', {
 *   env: { region: 'us-east-1' }
 * });
 * ```
 */
export class DeploymentStack extends Stack {
  /**
   * The deployment configuration used by this stack
   */
  public readonly config: DeploymentConfig;
  
  /**
   * Unified site construct
   */
  public unifiedSite!: UnifiedSiteConstruct;
  
  /**
   * Creates a new DeploymentStack
   * 
   * The constructor:
   * 1. Loads configuration from props or CDK context
   * 2. Validates the configuration
   * 3. Instantiates the UnifiedSiteConstruct
   * 4. Creates stack outputs for distribution URLs and other information
   * 
   * @param scope - The parent construct (typically the CDK App)
   * @param id - The stack ID
   * @param props - Stack properties including optional configuration
   */
  constructor(scope: Construct, id: string, props?: DeploymentStackProps) {
    super(scope, id, props);
    
    // Load configuration
    this.config = this.loadConfiguration(props);
    
    // Validate configuration
    this.validateConfiguration();
    
    // Deploy unified pattern
    this.deployUnifiedPattern();
    
    // Create stack outputs
    this.createOutputs();
  }
  
  /**
   * Loads configuration from props or CDK context
   * 
   * Priority order:
   * 1. Configuration passed in props
   * 2. CDK context parameters (--context flags)
   * 3. Configuration from CDK context
   * 4. Default configuration
   * 
   * @param props - Stack properties
   * @returns Complete deployment configuration
   */
  private loadConfiguration(props?: DeploymentStackProps): DeploymentConfig {
    // If configuration is provided in props, use it
    if (props?.config) {
      return props.config;
    }
    
    // Load from CDK context parameters first (highest priority)
    const contextDomainName = this.node.tryGetContext('domainName');
    const contextCertificateArn = this.node.tryGetContext('certificateArn');
    const contextRegion = this.node.tryGetContext('region');
    
    // Load base configuration from CDK context
    const context = this.node.tryGetContext('deployment');
    const config = ConfigurationManager.loadConfig({ deployment: context });
    
    // Override with context parameters if provided
    if (contextDomainName) {
      config.domainName = contextDomainName;
    }
    
    if (contextCertificateArn) {
      config.certificateArn = contextCertificateArn;
    }
    
    if (contextRegion) {
      config.region = contextRegion;
    }
    
    return config;
  }
  
  /**
   * Validates the configuration
   * 
   * Throws an error if configuration is invalid, displaying all validation
   * errors at once to help users fix all issues in one go.
   * 
   * @throws Error if configuration is invalid
   */
  private validateConfiguration(): void {
    const validation = ConfigurationManager.validateConfig(this.config);
    
    if (!validation.valid) {
      // Format all errors into a readable message
      const errorMessages = validation.errors.map((error, index) => {
        let message = `  ${index + 1}. ${error.field}: ${error.message}`;
        if (error.expected) {
          message += `\n     Expected: ${error.expected}`;
        }
        if (error.actual !== undefined) {
          message += `\n     Actual: ${JSON.stringify(error.actual)}`;
        }
        return message;
      }).join('\n\n');
      
      throw new Error(
        `Configuration validation failed:\n\n${errorMessages}\n\n` +
        'Please fix these errors and try again.'
      );
    }
    
    // Display warnings if any
    if (validation.warnings && validation.warnings.length > 0) {
      console.warn('\n⚠️  Configuration warnings:');
      validation.warnings.forEach((warning, index) => {
        console.warn(`  ${index + 1}. ${warning}`);
      });
      console.warn('');
    }
  }
  
  /**
   * Deploys using the unified pattern
   * 
   * Creates a single UnifiedSiteConstruct with all enabled sites.
   * All sites are served from a single CloudFront distribution with
   * path-based routing.
   * 
   * Validates Requirements: 2.1, 2.2, 2.3
   */
  private deployUnifiedPattern(): void {
    // Build array of site configurations for enabled sites
    const sites: SiteOriginConfig[] = [];
    
    if (this.config.sites.apiDocs.enabled) {
      sites.push({
        siteName: 'api-docs',
        sourceDir: this.config.sites.apiDocs.sourceDir,
        pathPattern: this.config.sites.apiDocs.pathPattern,
        pathRewrite: this.config.sites.apiDocs.pathRewrite,
      });
    }
    
    if (this.config.sites.demo.enabled) {
      sites.push({
        siteName: 'demo',
        sourceDir: this.config.sites.demo.sourceDir,
        pathPattern: this.config.sites.demo.pathPattern,
        pathRewrite: this.config.sites.demo.pathRewrite,
      });
    }
    
    if (this.config.sites.example.enabled) {
      sites.push({
        siteName: 'example',
        sourceDir: this.config.sites.example.sourceDir,
        pathPattern: this.config.sites.example.pathPattern,
        pathRewrite: this.config.sites.example.pathRewrite,
      });
    }
    
    // Check if at least one site is enabled
    if (sites.length === 0) {
      console.warn('⚠️  No sites are enabled for deployment');
      return;
    }
    
    // Log which sites are being deployed
    console.log(`📦 Deploying ${sites.length} sites:`);
    sites.forEach(site => {
      console.log(`  - ${site.siteName}: ${site.pathPattern} → ${site.sourceDir}`);
    });
    
    // Create unified site construct
    this.unifiedSite = new UnifiedSiteConstruct(this, 'UnifiedSite', {
      domainName: this.config.domainName,
      certificateArn: this.config.certificateArn,
      sites: sites,
      priceClass: this.getPriceClass(),
      enableLogging: this.config.logging.enabled,
      defaultRootObject: this.config.defaultRootObject,
    });
  }
  
  /**
   * Creates CloudFormation outputs for distribution URLs and other information
   * 
   * Outputs include:
   * - Distribution URLs for all deployed sites
   * - Distribution IDs for cache invalidation
   * - Bucket names for direct S3 access
   * - DNS configuration instructions for custom domains
   * 
   * Validates Requirements: 4.3, 6.4
   */
  private createOutputs(): void {
    if (!this.unifiedSite) {
      return;
    }
    
    // Distribution URL
    new CfnOutput(this, 'DistributionUrl', {
      value: this.unifiedSite.distributionUrl,
      description: 'CloudFront distribution URL',
      exportName: `${this.stackName}-DistributionUrl`,
    });
    
    // Distribution ID
    new CfnOutput(this, 'DistributionId', {
      value: this.unifiedSite.distribution.distributionId,
      description: 'CloudFront distribution ID',
      exportName: `${this.stackName}-DistributionId`,
    });
    
    // Custom domain
    new CfnOutput(this, 'DomainName', {
      value: this.unifiedSite.domainName,
      description: 'Custom domain name',
      exportName: `${this.stackName}-DomainName`,
    });
    
    // Route53 record status
    if (this.unifiedSite.route53Record) {
      new CfnOutput(this, 'Route53RecordCreated', {
        value: 'Yes',
        description: 'Route53 A record automatically created',
      });
    }
    
    // Bucket name for the unified bucket
    new CfnOutput(this, 'MainBucketName', {
      value: this.unifiedSite.bucket.bucketName,
      description: 'S3 bucket name for all sites',
      exportName: `${this.stackName}-MainBucketName`,
    });
    
    // Site URLs (with path patterns)
    if (this.config.sites.apiDocs.enabled) {
      new CfnOutput(this, 'ApiDocsUrl', {
        value: `https://${this.unifiedSite.domainName}${this.config.sites.apiDocs.pathPattern.replace('*', '')}`,
        description: 'API Docs site URL',
      });
    }
    
    if (this.config.sites.demo.enabled) {
      new CfnOutput(this, 'DemoUrl', {
        value: `https://${this.unifiedSite.domainName}${this.config.sites.demo.pathPattern.replace('*', '')}`,
        description: 'Demo site URL',
      });
    }
    
    if (this.config.sites.example.enabled) {
      new CfnOutput(this, 'ExampleUrl', {
        value: `https://${this.unifiedSite.domainName}/examples/genesis-ai/`,
        description: 'Genesis AI example site URL',
      });
    }
  }
  
  /**
   * Converts CloudFront price class string to enum value
   * 
   * @returns CloudFront PriceClass enum value
   */
  private getPriceClass(): cloudfront.PriceClass {
    const priceClassMap: Record<string, cloudfront.PriceClass> = {
      'PRICE_CLASS_100': cloudfront.PriceClass.PRICE_CLASS_100,
      'PRICE_CLASS_200': cloudfront.PriceClass.PRICE_CLASS_200,
      'PRICE_CLASS_ALL': cloudfront.PriceClass.PRICE_CLASS_ALL,
    };
    
    const priceClass = this.config.priceClass || 'PRICE_CLASS_100';
    return priceClassMap[priceClass] || cloudfront.PriceClass.PRICE_CLASS_100;
  }
  
  /**
   * Converts a kebab-case or snake-case string to PascalCase
   * 
   * @param str - String to convert
   * @returns PascalCase string
   */
  private toPascalCase(str: string): string {
    return str
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }
}
