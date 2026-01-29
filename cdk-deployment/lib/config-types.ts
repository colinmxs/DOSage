/**
 * Configuration types for AWS CDK multi-site deployment
 * 
 * This module defines the configuration interfaces and types used by the
 * ConfigurationManager to load and validate deployment configuration.
 * 
 * Uses unified deployment pattern: Single CloudFront distribution with path-based routing
 */

/**
 * Configuration for a site in unified deployment pattern
 */
export interface SiteConfig {
  /** Whether this site should be deployed */
  enabled: boolean;
  
  /** CloudFront path pattern for routing (e.g., /docs/*, /demo/*) */
  pathPattern: string;
  
  /** Local directory containing build artifacts */
  sourceDir: string;
  
  /** Optional path rewrite (e.g., /docs → /) */
  pathRewrite?: string;
  
  /** Build command to generate artifacts (optional) */
  buildCommand?: string;
  
  /** Working directory for build command (optional, defaults to project root) */
  buildWorkingDir?: string;
}

/**
 * Logging configuration
 */
export interface LoggingConfig {
  /** Whether to enable CloudFront access logging */
  enabled: boolean;
  
  /** Number of days to retain logs before deletion */
  retentionDays: number;
}

/**
 * Main deployment configuration
 * Uses unified deployment pattern with path-based routing
 */
export interface DeploymentConfig {
  /** AWS region for resource deployment */
  region: string;
  
  /** Primary domain for all sites */
  domainName: string;
  
  /** ACM certificate ARN for the domain (must be in us-east-1) */
  certificateArn: string;
  
  /** Configuration for each site */
  sites: {
    landing: SiteConfig;
    apiDocs: SiteConfig;
    demo: SiteConfig;
    example: SiteConfig;
  };
  
  /** Logging configuration */
  logging: LoggingConfig;
  
  /** CloudFront price class (optional, defaults to PRICE_CLASS_100) */
  priceClass?: 'PRICE_CLASS_100' | 'PRICE_CLASS_200' | 'PRICE_CLASS_ALL';
  
  /** Default root object for CloudFront distributions (optional, defaults to index.html) */
  defaultRootObject?: string;
  
  /** Environment name (e.g., dev, staging, prod) */
  environment?: string;
}

/**
 * Validation error details
 */
export interface ValidationError {
  /** Field path that failed validation (e.g., 'sites.demo.domainName') */
  field: string;
  
  /** Error message describing the validation failure */
  message: string;
  
  /** Expected value or format */
  expected?: string;
  
  /** Actual value that failed validation */
  actual?: unknown;
}

/**
 * Result of configuration validation
 */
export interface ValidationResult {
  /** Whether the configuration is valid */
  valid: boolean;
  
  /** List of validation errors (empty if valid) */
  errors: ValidationError[];
  
  /** Optional warnings that don't prevent deployment */
  warnings?: string[];
}

/**
 * Site origin configuration for UnifiedSiteConstruct
 */
export interface SiteOriginConfig {
  /** Unique identifier for the site */
  siteName: string;
  
  /** Local directory containing build artifacts */
  sourceDir: string;
  
  /** CloudFront path pattern (e.g., /docs/*) */
  pathPattern: string;
  
  /** Optional path rewrite (e.g., /docs → /) */
  pathRewrite?: string;
}

/**
 * Build configuration for a site
 */
export interface BuildConfig {
  /** npm command to execute */
  command: string;
  
  /** Directory to run command in */
  workingDir: string;
  
  /** Expected output directory */
  outputDir: string;
}

/**
 * Result of a build operation
 */
export interface BuildResult {
  /** Whether the build succeeded */
  success: boolean;
  
  /** Name of the site that was built */
  siteName: string;
  
  /** Output directory containing build artifacts */
  outputDir: string;
  
  /** Error message if build failed */
  error?: string;
  
  /** Build duration in milliseconds */
  duration: number;
}

/**
 * Deployment output information
 */
export interface DeploymentOutput {
  /** Name of the deployed site */
  siteName: string;
  
  /** CloudFront distribution URL */
  distributionUrl: string;
  
  /** CloudFront distribution ID */
  distributionId: string;
  
  /** S3 bucket name */
  bucketName: string;
  
  /** Custom domain (if configured) */
  customDomain?: string;
  
  /** DNS configuration instructions (if custom domain used) */
  dnsInstructions?: string;
}
