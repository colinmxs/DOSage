/**
 * ConfigurationManager - Handles loading and validating deployment configuration
 * 
 * This module provides functionality to:
 * - Load configuration from cdk.json context and environment variables
 * - Provide sensible default values for optional configuration
 * - Validate all configuration values before deployment
 * 
 * Configuration priority (highest to lowest):
 * 1. Environment variables (CDK_DEPLOY_*)
 * 2. cdk.json context section
 * 3. Default values
 * 
 * Validates Requirements: 8.1, 8.2, 8.5
 */

import {
  DeploymentConfig,
  ValidationResult,
  ValidationError,
  SiteConfig,
} from './config-types';

/**
 * ConfigurationManager class
 * Handles loading, validation, and default values for deployment configuration
 */
export class ConfigurationManager {
  /**
   * Load configuration from cdk.json context and environment variables
   * 
   * Priority order:
   * 1. Environment variables (CDK_DEPLOY_*)
   * 2. CDK context (passed as parameter)
   * 3. Default values
   * 
   * @param context - CDK context object from app.node.tryGetContext()
   * @returns Complete deployment configuration
   */
  static loadConfig(context?: any): DeploymentConfig {
    // Start with defaults
    const config = this.getDefaults();
    
    // Load from CDK context if provided
    if (context && context.deployment) {
      const ctxDeployment = context.deployment;
      
      // Override with context values
      if (ctxDeployment.region) {
        config.region = ctxDeployment.region;
      }
      
      if (ctxDeployment.domainName) {
        config.domainName = ctxDeployment.domainName;
      }
      
      if (ctxDeployment.certificateArn) {
        config.certificateArn = ctxDeployment.certificateArn;
      }
      
      if (ctxDeployment.priceClass) {
        config.priceClass = ctxDeployment.priceClass;
      }
      
      if (ctxDeployment.defaultRootObject) {
        config.defaultRootObject = ctxDeployment.defaultRootObject;
      }
      
      if (ctxDeployment.environment) {
        config.environment = ctxDeployment.environment;
      }
      
      // Load logging configuration
      if (ctxDeployment.logging) {
        config.logging = {
          enabled: ctxDeployment.logging.enabled ?? config.logging.enabled,
          retentionDays: ctxDeployment.logging.retentionDays ?? config.logging.retentionDays,
        };
      }
      
      // Load site configurations
      if (ctxDeployment.sites) {
        if (ctxDeployment.sites.apiDocs) {
          config.sites.apiDocs = this.loadSiteConfig(ctxDeployment.sites.apiDocs);
        }
        if (ctxDeployment.sites.demo) {
          config.sites.demo = this.loadSiteConfig(ctxDeployment.sites.demo);
        }
        if (ctxDeployment.sites.example) {
          config.sites.example = this.loadSiteConfig(ctxDeployment.sites.example);
        }
      }
    }
    
    // Override with environment variables
    this.loadFromEnvironment(config);
    
    return config;
  }
  
  /**
   * Load site configuration
   */
  private static loadSiteConfig(site: any): SiteConfig {
    return {
      enabled: site?.enabled ?? false,
      pathPattern: site?.pathPattern ?? '/*',
      sourceDir: site?.sourceDir ?? '',
      pathRewrite: site?.pathRewrite,
      buildCommand: site?.buildCommand,
      buildWorkingDir: site?.buildWorkingDir,
    };
  }
  
  /**
   * Load configuration from environment variables
   * Environment variables override context values
   * 
   * Supported environment variables:
   * - CDK_DOMAIN_NAME: Domain name
   * - CDK_CERTIFICATE_ARN: Certificate ARN
   * - AWS_REGION: AWS region
   * - CDK_DEPLOY_ENVIRONMENT: Environment name (dev, staging, prod)
   * - CDK_DEPLOY_PRICE_CLASS: CloudFront price class
   */
  private static loadFromEnvironment(config: DeploymentConfig): void {
    if (process.env.AWS_REGION) {
      config.region = process.env.AWS_REGION;
    }
    
    if (process.env.CDK_DEPLOY_ENVIRONMENT) {
      config.environment = process.env.CDK_DEPLOY_ENVIRONMENT;
    }
    
    if (process.env.CDK_DOMAIN_NAME) {
      config.domainName = process.env.CDK_DOMAIN_NAME;
    }
    
    if (process.env.CDK_CERTIFICATE_ARN) {
      config.certificateArn = process.env.CDK_CERTIFICATE_ARN;
    }
    
    if (process.env.CDK_DEPLOY_PRICE_CLASS) {
      const priceClass = process.env.CDK_DEPLOY_PRICE_CLASS;
      if (priceClass === 'PRICE_CLASS_100' || priceClass === 'PRICE_CLASS_200' || priceClass === 'PRICE_CLASS_ALL') {
        config.priceClass = priceClass;
      }
    }
  }
  
  /**
   * Get default configuration values
   * These are sensible defaults that work for most deployments
   * 
   * @returns Default deployment configuration
   */
  static getDefaults(): DeploymentConfig {
    return {
      region: 'us-east-1',
      domainName: '',
      certificateArn: '',
      sites: {
        apiDocs: {
          enabled: false,
          pathPattern: '/docs/*',
          sourceDir: '../docs/api/',
        },
        demo: {
          enabled: false,
          pathPattern: '/demo/*',
          sourceDir: '../demo/dist/',
        },
        example: {
          enabled: false,
          pathPattern: '/examples/*',
          sourceDir: '../examples/genesis-ai/dist/',
        },
      },
      logging: {
        enabled: true,
        retentionDays: 30,
      },
      priceClass: 'PRICE_CLASS_100',
      defaultRootObject: 'index.html',
      environment: 'dev',
    };
  }
  
  /**
   * Validate deployment configuration
   * Checks all configuration values for correctness before deployment
   * 
   * @param config - Configuration to validate
   * @returns Validation result with errors and warnings
   */
  static validateConfig(config: DeploymentConfig): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];
    
    // Validate region
    if (!config.region || config.region.trim() === '') {
      errors.push({
        field: 'region',
        message: 'Region is required',
        expected: 'Valid AWS region (e.g., us-east-1, eu-west-1)',
        actual: config.region,
      });
    } else if (!this.isValidRegion(config.region)) {
      errors.push({
        field: 'region',
        message: 'Invalid AWS region',
        expected: 'Valid AWS region (e.g., us-east-1, eu-west-1)',
        actual: config.region,
      });
    }
    
    // Validate domain name
    if (!config.domainName) {
      errors.push({
        field: 'domainName',
        message: 'Domain name is required',
        expected: 'Valid domain name (e.g., example.com)',
        actual: config.domainName,
      });
    } else if (!this.isValidDomain(config.domainName)) {
      errors.push({
        field: 'domainName',
        message: 'Invalid domain name',
        expected: 'Valid domain name (e.g., example.com)',
        actual: config.domainName,
      });
    }
    
    // Validate certificate ARN
    if (!config.certificateArn) {
      errors.push({
        field: 'certificateArn',
        message: 'Certificate ARN is required',
        expected: 'Valid ACM certificate ARN',
        actual: config.certificateArn,
      });
    } else if (!this.isValidCertificateArn(config.certificateArn)) {
      errors.push({
        field: 'certificateArn',
        message: 'Invalid certificate ARN',
        expected: 'Valid ACM certificate ARN (arn:aws:acm:us-east-1:...)',
        actual: config.certificateArn,
      });
    } else if (!config.certificateArn.includes(':us-east-1:')) {
      errors.push({
        field: 'certificateArn',
        message: 'Certificate must be in us-east-1 region for CloudFront',
        expected: 'Certificate ARN with us-east-1 region',
        actual: config.certificateArn,
      });
    }
    
    // Validate sites
    const sites = config.sites;
    if (!sites) {
      errors.push({
        field: 'sites',
        message: 'Sites configuration is required',
        expected: 'Sites configuration object',
        actual: sites,
      });
      return {
        valid: errors.length === 0,
        errors,
        warnings,
      };
    }
    
    // Check if at least one site is enabled
    const enabledSites = [sites.apiDocs?.enabled, sites.demo?.enabled, sites.example?.enabled].filter(Boolean);
    if (enabledSites.length === 0) {
      warnings.push('No sites are enabled for deployment');
    }
    
    // Validate each site
    if (sites.apiDocs?.enabled) {
      this.validateSite('sites.apiDocs', sites.apiDocs, errors);
    }
    if (sites.demo?.enabled) {
      this.validateSite('sites.demo', sites.demo, errors);
    }
    if (sites.example?.enabled) {
      this.validateSite('sites.example', sites.example, errors);
    }
    
    // Validate logging configuration
    if (config.logging) {
      if (typeof config.logging.enabled !== 'boolean') {
        errors.push({
          field: 'logging.enabled',
          message: 'Logging enabled must be a boolean',
          expected: 'true or false',
          actual: config.logging.enabled,
        });
      }
      
      if (config.logging.retentionDays !== undefined && (config.logging.retentionDays < 1 || config.logging.retentionDays > 365)) {
        errors.push({
          field: 'logging.retentionDays',
          message: 'Retention days must be between 1 and 365',
          expected: '1-365',
          actual: config.logging.retentionDays,
        });
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
  
  /**
   * Validate site configuration
   */
  private static validateSite(
    fieldPrefix: string,
    site: SiteConfig,
    errors: ValidationError[]
  ): void {
    if (!site.sourceDir) {
      errors.push({
        field: `${fieldPrefix}.sourceDir`,
        message: 'Source directory is required',
        expected: 'Path to build artifacts directory',
        actual: site.sourceDir,
      });
    }
    
    if (!site.pathPattern) {
      errors.push({
        field: `${fieldPrefix}.pathPattern`,
        message: 'Path pattern is required',
        expected: 'CloudFront path pattern (e.g., /docs/*)',
        actual: site.pathPattern,
      });
    } else if (!site.pathPattern.startsWith('/')) {
      errors.push({
        field: `${fieldPrefix}.pathPattern`,
        message: 'Path pattern must start with /',
        expected: 'Path starting with / (e.g., /docs/*)',
        actual: site.pathPattern,
      });
    }
  }
  
  /**
   * Check if a region is valid
   */
  private static isValidRegion(region: string): boolean {
    // List of valid AWS regions (as of 2024)
    const validRegions = [
      'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
      'af-south-1', 'ap-east-1', 'ap-south-1', 'ap-south-2',
      'ap-northeast-1', 'ap-northeast-2', 'ap-northeast-3',
      'ap-southeast-1', 'ap-southeast-2', 'ap-southeast-3', 'ap-southeast-4',
      'ca-central-1', 'ca-west-1',
      'eu-central-1', 'eu-central-2', 'eu-west-1', 'eu-west-2', 'eu-west-3',
      'eu-south-1', 'eu-south-2', 'eu-north-1',
      'il-central-1',
      'me-south-1', 'me-central-1',
      'sa-east-1',
    ];
    return validRegions.includes(region);
  }
  
  /**
   * Check if a domain name is valid
   */
  private static isValidDomain(domain: string): boolean {
    // Basic domain validation regex
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
    return domainRegex.test(domain);
  }
  
  /**
   * Check if a certificate ARN is valid
   */
  private static isValidCertificateArn(arn: string): boolean {
    // ACM certificate ARN format: arn:aws:acm:region:account-id:certificate/certificate-id
    const arnRegex = /^arn:aws:acm:[a-z0-9-]+:\d{12}:certificate\/[a-f0-9-]+$/;
    return arnRegex.test(arn);
  }
}
