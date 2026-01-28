# Design Document: AWS CDK Multi-Site Deployment

## Overview

This design describes an AWS CDK infrastructure-as-code solution for deploying three static websites from the DOSage TypeScript component library. The system uses AWS S3 for storage, CloudFront for content delivery, and provides automated deployment workflows with cache invalidation.

The architecture follows AWS best practices for static website hosting:
- S3 buckets serve as private origins (not public websites)
- CloudFront distributions provide global CDN with HTTPS
- Origin Access Identity (OAI) or Origin Access Control (OAC) secures S3 access
- Each site is independently deployable with its own stack or nested construct

## Architecture

### High-Level Architecture

The system supports two deployment patterns:

**Pattern 1: Unified Domain (Recommended for Related Sites)**
All sites under a single domain with path-based routing:
- `example.com/docs/*` → API Documentation
- `example.com/demo/*` → Demo Site
- `example.com/examples/*` → Example Projects

**Pattern 2: Separate Domains**
Each site on its own domain or subdomain:
- `docs.example.com` → API Documentation
- `demo.example.com` → Demo Site
- `examples.example.com` → Example Projects

#### Pattern 1: Unified Domain Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     AWS CDK Application                      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Unified Deployment Stack                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         AWS Cloud                            │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Single CloudFront Distribution                │  │
│  │                                                        │  │
│  │  Path Pattern: /docs/*    → API Docs Origin          │  │
│  │  Path Pattern: /demo/*    → Demo Origin              │  │
│  │  Path Pattern: /examples/* → Examples Origin         │  │
│  │  Default (/)              → Landing Page or Redirect │  │
│  └───────┬──────────────┬──────────────┬─────────────────┘  │
│          │              │              │                    │
│  ┌───────▼──────────────▼──────────────▼─────────────────┐  │
│  │                 S3 Buckets (Private)                  │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │  │ API Docs │  │   Demo   │  │ Examples │           │  │
│  │  │  Bucket  │  │  Bucket  │  │  Bucket  │           │  │
│  │  └──────────┘  └──────────┘  └──────────┘           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

#### Pattern 2: Separate Domains Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     AWS CDK Application                      │
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐│
│  │  API Docs      │  │  Demo Site     │  │  Example Site  ││
│  │  Stack         │  │  Stack         │  │  Stack         ││
│  └────────────────┘  └────────────────┘  └────────────────┘│
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         AWS Cloud                            │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              CloudFront Distributions                 │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │  │
│  │  │ API Docs │  │   Demo   │  │ Examples │          │  │
│  │  │   CDN    │  │   CDN    │  │   CDN    │          │  │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘          │  │
│  └───────┼─────────────┼─────────────┼─────────────────┘  │
│          │             │             │                     │
│  ┌───────▼─────────────▼─────────────▼─────────────────┐  │
│  │                 S3 Buckets (Private)                 │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │  │
│  │  │ API Docs │  │   Demo   │  │ Examples │          │  │
│  │  │  Bucket  │  │  Bucket  │  │  Bucket  │          │  │
│  │  └──────────┘  └──────────┘  └──────────┘          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Deployment Flow

```
┌─────────────┐
│  Developer  │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Build Scripts  │
│  - npm run docs │
│  - npm run      │
│    build:demo   │
│  - npm run      │
│    build        │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Build Outputs  │
│  - docs/api/    │
│  - demo/dist/   │
│  - examples/    │
│    genesis-ai/  │
│    dist/        │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│   CDK Deploy    │
│  - cdk synth    │
│  - cdk deploy   │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  S3 Upload +    │
│  CloudFront     │
│  Invalidation   │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Live Websites  │
└─────────────────┘
```

## Components and Interfaces

### 1. UnifiedSiteConstruct (Pattern 1)

A CDK construct that creates a single CloudFront distribution with multiple S3 origins for path-based routing.

**Interface:**
```typescript
interface SiteOriginConfig {
  siteName: string;              // Unique identifier for the site
  sourceDir: string;             // Local directory containing build artifacts
  pathPattern: string;           // CloudFront path pattern (e.g., /docs/*)
  pathRewrite?: string;          // Optional path rewrite (e.g., /docs → /)
}

interface UnifiedSiteProps {
  domainName: string;            // Primary domain for all sites
  certificateArn: string;        // ACM certificate ARN for the domain
  sites: SiteOriginConfig[];     // Array of site configurations
  priceClass?: PriceClass;       // CloudFront price class (default: PRICE_CLASS_100)
  enableLogging?: boolean;       // Enable CloudFront access logs (default: true)
  defaultRootObject?: string;    // Default root object (default: index.html)
}

class UnifiedSiteConstruct extends Construct {
  public readonly buckets: Map<string, s3.Bucket>;
  public readonly distribution: cloudfront.Distribution;
  public readonly distributionUrl: string;
  public readonly domainName: string;
  
  constructor(scope: Construct, id: string, props: UnifiedSiteProps);
}
```

**Responsibilities:**
- Create separate S3 buckets for each site
- Create single CloudFront distribution with multiple origins
- Configure path-based cache behaviors for each site
- Set up CloudFront Functions for path rewriting if needed
- Configure error responses for SPA routing
- Set up bucket deployment with automatic invalidation
- Output distribution URL and domain information

### 2. StaticSiteConstruct (Pattern 2)

A reusable CDK construct that encapsulates the infrastructure for a single static website with its own distribution.

**Interface:**
```typescript
interface StaticSiteProps {
  siteName: string;              // Unique identifier for the site
  sourceDir: string;             // Local directory containing build artifacts
  domainName?: string;           // Optional custom domain
  certificateArn?: string;       // Optional ACM certificate ARN
  errorResponsePath?: string;    // Path to error document (default: /index.html)
  priceClass?: PriceClass;       // CloudFront price class (default: PRICE_CLASS_100)
  enableLogging?: boolean;       // Enable CloudFront access logs (default: true)
}

class StaticSiteConstruct extends Construct {
  public readonly bucket: s3.Bucket;
  public readonly distribution: cloudfront.Distribution;
  public readonly distributionUrl: string;
  
  constructor(scope: Construct, id: string, props: StaticSiteProps);
}
```

**Responsibilities:**
- Create S3 bucket with appropriate configuration
- Create CloudFront distribution with OAC
- Configure cache behaviors and error responses
- Set up bucket deployment with automatic invalidation
- Output distribution URL and domain information

### 3. DeploymentStack

The main CDK stack that orchestrates deployment. Supports both unified and separate deployment patterns.

**Interface:**
```typescript
interface DeploymentStackProps extends StackProps {
  deploymentPattern: 'unified' | 'separate';  // Deployment pattern to use
  
  // For unified pattern
  unifiedConfig?: {
    domainName: string;
    certificateArn: string;
    sites: {
      apiDocs: { enabled: boolean; pathPattern: string; sourceDir: string; };
      demo: { enabled: boolean; pathPattern: string; sourceDir: string; };
      example: { enabled: boolean; pathPattern: string; sourceDir: string; };
    };
  };
  
  // For separate pattern
  separateConfig?: {
    apiDocs?: SiteConfig;
    demo?: SiteConfig;
    example?: SiteConfig;
  };
}

interface SiteConfig {
  enabled: boolean;              // Whether to deploy this site
  domainName?: string;           // Custom domain
  certificateArn?: string;       // ACM certificate ARN
  sourceDir: string;             // Source directory
}

class DeploymentStack extends Stack {
  public readonly unifiedSite?: UnifiedSiteConstruct;
  public readonly apiDocsSite?: StaticSiteConstruct;
  public readonly demoSite?: StaticSiteConstruct;
  public readonly exampleSite?: StaticSiteConstruct;
  
  constructor(scope: Construct, id: string, props: DeploymentStackProps);
}
```

**Responsibilities:**
- Determine deployment pattern from configuration
- For unified pattern: Instantiate UnifiedSiteConstruct with all sites
- For separate pattern: Instantiate StaticSiteConstruct for each enabled site
- Read configuration from CDK context or environment variables
- Output all distribution URLs and configuration details
- Manage cross-site dependencies if any

### 4. BuildIntegration

A utility module that handles build command execution before deployment.

**Interface:**
```typescript
interface BuildConfig {
  command: string;               // npm command to execute
  workingDir: string;            // Directory to run command in
  outputDir: string;             // Expected output directory
}

class BuildIntegration {
  static async buildSite(config: BuildConfig): Promise<void>;
  static async buildAll(): Promise<void>;
  static validateOutputExists(outputDir: string): boolean;
}
```

**Responsibilities:**
- Execute npm build commands
- Validate build outputs exist
- Report build errors with clear messages
- Support parallel builds for faster deployment

### 5. ConfigurationManager

Handles reading and validating deployment configuration.

**Interface:**
```typescript
interface DeploymentConfig {
  region: string;
  deploymentPattern: 'unified' | 'separate';
  
  // Unified pattern configuration
  unified?: {
    domainName: string;
    certificateArn: string;
    sites: {
      apiDocs: { enabled: boolean; pathPattern: string; };
      demo: { enabled: boolean; pathPattern: string; };
      example: { enabled: boolean; pathPattern: string; };
    };
  };
  
  // Separate pattern configuration
  separate?: {
    apiDocs: SiteConfig;
    demo: SiteConfig;
    example: SiteConfig;
  };
  
  logging: {
    enabled: boolean;
    retentionDays: number;
  };
}

class ConfigurationManager {
  static loadConfig(): DeploymentConfig;
  static validateConfig(config: DeploymentConfig): ValidationResult;
  static getDefaults(): DeploymentConfig;
}
```

**Responsibilities:**
- Load configuration from cdk.json context or environment variables
- Validate all configuration values
- Provide sensible defaults
- Support environment-specific overrides

## Data Models

### Site Configuration

```typescript
interface SiteConfig {
  enabled: boolean;
  domainName?: string;
  certificateArn?: string;
  sourceDir: string;
  buildCommand?: string;
  buildWorkingDir?: string;
}
```

### Deployment Output

```typescript
interface DeploymentOutput {
  siteName: string;
  distributionUrl: string;
  distributionId: string;
  bucketName: string;
  customDomain?: string;
  dnsInstructions?: string;
}
```

### Build Result

```typescript
interface BuildResult {
  success: boolean;
  siteName: string;
  outputDir: string;
  error?: string;
  duration: number;
}
```

## Implementation Details

### Path-Based Routing (Unified Pattern)

When using the unified deployment pattern, a single CloudFront distribution serves all sites using path-based routing:

**CloudFront Configuration:**
- **Multiple Origins**: One S3 origin per site
- **Cache Behaviors**: Ordered by specificity (most specific first)
  1. `/docs/*` → API Docs origin
  2. `/demo/*` → Demo origin
  3. `/examples/*` → Examples origin
  4. Default (`/*`) → Landing page or redirect

**Path Rewriting with CloudFront Functions:**

Since S3 buckets contain files at the root (e.g., `index.html`, `assets/`), but CloudFront serves them at paths (e.g., `/docs/index.html`), we need to rewrite paths:

```javascript
// CloudFront Function for /docs/* path
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  
  // Remove /docs prefix for S3 origin
  if (uri.startsWith('/docs/')) {
    request.uri = uri.substring(5); // Remove '/docs'
  } else if (uri === '/docs') {
    request.uri = '/index.html';
  }
  
  // Default to index.html for directory requests
  if (request.uri.endsWith('/')) {
    request.uri += 'index.html';
  }
  
  return request;
}
```

**Benefits of Unified Pattern:**
- Single domain for all related sites
- Simpler DNS configuration (one domain)
- Lower cost (one CloudFront distribution vs three)
- Easier to manage SSL certificate (one cert for all sites)
- Better for SEO (all content under same domain)

**Drawbacks of Unified Pattern:**
- More complex CloudFront configuration
- All sites must be deployed together (or carefully managed)
- Path conflicts must be avoided
- Slightly more complex invalidation (need to specify paths)

### S3 Bucket Configuration

Each S3 bucket will be configured with:
- **Block Public Access**: All public access blocked (content served via CloudFront only)
- **Versioning**: Disabled (not needed for static sites)
- **Encryption**: AES256 server-side encryption
- **Lifecycle Rules**: Optional transition to Infrequent Access after 90 days
- **CORS**: Configured if needed for cross-origin requests
- **Removal Policy**: RETAIN for production, DESTROY for development

### CloudFront Distribution Configuration

Each distribution will be configured with:
- **Origin**: S3 bucket with Origin Access Control (OAC)
- **Default Root Object**: index.html
- **Error Responses**: 
  - 403 → /index.html (for SPA routing)
  - 404 → /index.html (for SPA routing)
- **Cache Behavior**:
  - Viewer Protocol Policy: REDIRECT_TO_HTTPS
  - Allowed Methods: GET, HEAD, OPTIONS
  - Cached Methods: GET, HEAD
  - Compress: true
  - TTL: Default 86400 (1 day), Max 31536000 (1 year)
- **Price Class**: PRICE_CLASS_100 (North America and Europe)
- **HTTP Version**: HTTP/2 and HTTP/3 enabled
- **Logging**: Enabled to separate S3 bucket

### Cache Invalidation Strategy

After each deployment:
1. Upload new files to S3
2. Create CloudFront invalidation for `/*` (all paths)
3. Wait for invalidation to complete (typically 30-60 seconds)
4. Report success with new distribution URL

For selective invalidation:
- Track changed files during upload
- Invalidate only changed paths
- Fallback to full invalidation if too many changes

### Custom Domain Configuration

When custom domains are specified:
1. Validate certificate exists in ACM (must be in us-east-1 for CloudFront)
2. Add domain as alias to CloudFront distribution
3. Output DNS configuration instructions:
   - CNAME record pointing to CloudFront domain
   - Or A/AAAA records using Route53 alias (if using Route53)

### Build Integration

Pre-deployment build process:
1. Check if output directories exist
2. If missing or `--rebuild` flag set, run build commands
3. Execute builds in parallel where possible
4. Validate outputs exist after build
5. Proceed to CDK deployment

Build commands:
- **API Docs**: `npm run docs` (root directory) → `docs/api/`
- **Demo**: `npm run build:demo` (root directory) → `demo/dist/`
- **Example**: `npm run build` (examples/genesis-ai/) → `examples/genesis-ai/dist/`

### Environment Configuration

Configuration priority (highest to lowest):
1. Command-line arguments (--context flags)
2. Environment variables (CDK_DEPLOY_*)
3. cdk.json context section
4. Default values

**Example cdk.json for Unified Pattern:**
```json
{
  "context": {
    "deployment": {
      "region": "us-east-1",
      "deploymentPattern": "unified",
      "unified": {
        "domainName": "dosage.dev",
        "certificateArn": "arn:aws:acm:us-east-1:123456789012:certificate/...",
        "sites": {
          "apiDocs": {
            "enabled": true,
            "pathPattern": "/docs/*"
          },
          "demo": {
            "enabled": true,
            "pathPattern": "/demo/*"
          },
          "example": {
            "enabled": true,
            "pathPattern": "/examples/*"
          }
        }
      }
    }
  }
}
```

**Example cdk.json for Separate Pattern:**
```json
{
  "context": {
    "deployment": {
      "region": "us-east-1",
      "deploymentPattern": "separate",
      "separate": {
        "apiDocs": {
          "enabled": true,
          "domainName": "docs.dosage.dev",
          "certificateArn": "arn:aws:acm:us-east-1:123456789012:certificate/..."
        },
        "demo": {
          "enabled": true,
          "domainName": "demo.dosage.dev",
          "certificateArn": "arn:aws:acm:us-east-1:123456789012:certificate/..."
        },
        "example": {
          "enabled": true,
          "domainName": "examples.dosage.dev",
          "certificateArn": "arn:aws:acm:us-east-1:123456789012:certificate/..."
        }
      }
    }
  }
}
```

### Cost Optimization

Cost-saving measures:
- **S3**: Use Standard storage (cheapest for frequently accessed content)
- **CloudFront**: 
  - Price Class 100 (North America + Europe only)
  - Enable compression to reduce data transfer
  - Appropriate cache TTLs to minimize origin requests
  - **Unified pattern**: Use single distribution to save on distribution costs
- **Logging**: Set lifecycle policy to delete logs after 30 days
- **Invalidations**: Limit to 1000 free paths per month (use wildcard efficiently)

**Estimated monthly costs (assuming low traffic):**

*Unified Pattern:*
- S3 storage: ~$0.50 total (20GB across 3 buckets)
- CloudFront: ~$1-5 (single distribution)
- Total: ~$2-6/month

*Separate Pattern:*
- S3 storage: ~$0.50 total (20GB across 3 buckets)
- CloudFront: ~$3-15 (three distributions)
- Total: ~$4-16/month

**Recommendation**: Use unified pattern for related sites to minimize costs.


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Infrastructure Creation Properties

**Property 1: S3 Bucket Creation with Security Configuration**
*For any* static site deployment, the CDK stack should create an S3 bucket with block public access enabled, server-side encryption configured, and appropriate removal policy set.
**Validates: Requirements 1.1, 5.5**

**Property 2: CloudFront Distribution with S3 Origin**
*For any* static site deployment, the CDK stack should create a CloudFront distribution with the S3 bucket configured as its origin using Origin Access Control.
**Validates: Requirements 1.2**

**Property 3: HTTPS Enforcement**
*For any* CloudFront distribution created, the viewer protocol policy should be set to redirect HTTP to HTTPS.
**Validates: Requirements 1.4**

**Property 4: SPA Routing Support**
*For any* CloudFront distribution created, requesting a non-existent path should return index.html with appropriate error response configuration (403/404 → index.html).
**Validates: Requirements 1.5**

**Property 5: Site Isolation**
*For any* site deployment, deploying or updating one site should not modify the infrastructure or content of other deployed sites.
**Validates: Requirements 2.4**

**Property 6: Unique Distribution URLs**
*For any* set of deployed sites, all CloudFront distribution URLs should be unique (no two sites share the same distribution URL).
**Validates: Requirements 2.5**

**Property 7: Path-Based Routing (Unified Pattern)**
*For any* unified deployment with multiple sites, each site's content should be accessible at its configured path pattern (e.g., /docs/*, /demo/*, /examples/*) and requests to those paths should be routed to the correct S3 origin.
**Validates: Requirements 2.1, 2.2, 2.3**

### Build and Deployment Properties

**Property 7: Build Failure Halts Deployment**
*For any* build command that fails, the deployment pipeline should halt before attempting CDK deployment and report the build error.
**Validates: Requirements 3.4**

**Property 8: Output Directory Upload Completeness**
*For any* successful build, the S3 bucket contents should exactly match the build output directory contents (no extra files, no missing files).
**Validates: Requirements 3.5**

### Domain Configuration Properties

**Property 9: Custom Domain Configuration**
*For any* site deployed with a custom domain specified, the CloudFront distribution should have that domain configured as an alias and have an associated SSL/TLS certificate.
**Validates: Requirements 4.1, 4.2**

**Property 10: DNS Instructions Output**
*For any* site deployed with a custom domain, the deployment outputs should include DNS configuration instructions.
**Validates: Requirements 4.3**

**Property 11: Subdomain Support**
*For any* set of sites configured with subdomains of the same parent domain, all sites should deploy successfully with their respective subdomain configurations.
**Validates: Requirements 4.5**

### Cost Optimization Properties

**Property 12: S3 Lifecycle and Storage Configuration**
*For any* S3 bucket created, it should have lifecycle policies configured and use Standard storage class for uploaded objects.
**Validates: Requirements 5.1, 5.2**

**Property 13: CloudFront Cache Optimization**
*For any* CloudFront distribution created, it should have cache behaviors configured with appropriate TTL values and compression enabled.
**Validates: Requirements 5.3, 5.4**

**Property 14: Private S3 with CloudFront Access**
*For any* deployed site, direct S3 bucket access should be blocked (return 403), while CloudFront access should succeed (return 200 for valid paths).
**Validates: Requirements 5.5**

### Deployment Automation Properties

**Property 15: Infrastructure Change Preview**
*For any* infrastructure change, running `cdk diff` should display the changes before deployment without applying them.
**Validates: Requirements 6.2**

**Property 16: Selective Stack Deployment**
*For any* subset of stacks selected for deployment, only those stacks should be deployed and other stacks should remain unchanged.
**Validates: Requirements 6.3**

**Property 17: Deployment Output Completeness**
*For any* successful deployment, the outputs should include distribution URLs, distribution IDs, bucket names, and custom domain information (if applicable) for all deployed sites.
**Validates: Requirements 6.4**

### Cache Invalidation Properties

**Property 18: Automatic Invalidation on Deployment**
*For any* content deployment to a site, a CloudFront invalidation should be created for all paths (/*).
**Validates: Requirements 7.1**

**Property 19: Invalidation Completion Wait**
*For any* deployment with invalidation, the deployment process should wait for invalidation completion before reporting success.
**Validates: Requirements 7.2**

**Property 20: Invalidation Failure Handling**
*For any* invalidation that fails, the S3 content should remain uploaded and an error should be reported without rolling back the upload.
**Validates: Requirements 7.3**

**Property 21: Invalidation Permissions**
*For any* deployed stack, the deployment role should have cloudfront:CreateInvalidation permission for the created distributions.
**Validates: Requirements 7.4**

**Property 22: Selective Path Invalidation**
*For any* set of specific paths requested for invalidation, only those paths should be invalidated (not all paths).
**Validates: Requirements 7.5**

### Configuration Properties

**Property 23: Configuration Loading**
*For any* valid configuration provided via CDK context or environment variables, the CDK stack should read and apply that configuration.
**Validates: Requirements 8.1**

**Property 24: Default Configuration Values**
*For any* configuration value not provided, the CDK stack should use a sensible default value and deploy successfully.
**Validates: Requirements 8.2**

**Property 25: Per-Site Domain Configuration**
*For any* configuration specifying different custom domains for different sites, each site should be deployed with its respective custom domain.
**Validates: Requirements 8.3**

**Property 26: Region Configuration**
*For any* valid AWS region specified in configuration, resources should be created in that region (except ACM certificates which must be in us-east-1 for CloudFront).
**Validates: Requirements 8.4**

**Property 27: Configuration Validation**
*For any* invalid configuration value, the CDK stack should fail validation before attempting any AWS API calls and provide a descriptive error message.
**Validates: Requirements 8.5**

### Error Handling Properties

**Property 28: Descriptive Deployment Errors**
*For any* deployment error, the error message should include the failure point and relevant context (resource name, operation attempted).
**Validates: Requirements 9.1**

**Property 29: Build Error Output**
*For any* build command failure, the complete build error logs should be output to the console.
**Validates: Requirements 9.2**

**Property 30: AWS Error Reporting**
*For any* AWS API call failure, the error message should include the AWS error message and the affected resource identifier.
**Validates: Requirements 9.3**

**Property 31: CloudFront Access Logging**
*For any* CloudFront distribution created, access logging should be enabled with an S3 bucket configured as the log destination.
**Validates: Requirements 9.4**

### Resource Cleanup Properties

**Property 32: Complete Resource Removal**
*For any* deployed stack, running `cdk destroy` should remove all created AWS resources (S3 buckets, CloudFront distributions, IAM roles, etc.).
**Validates: Requirements 10.1**

**Property 33: Non-Empty Bucket Protection**
*For any* S3 bucket containing content, attempting to destroy the stack should require explicit confirmation or fail with an error indicating the bucket must be emptied first.
**Validates: Requirements 10.3**

**Property 34: CloudFront Distribution Cleanup**
*For any* stack destruction, all CloudFront distributions created by that stack should be removed.
**Validates: Requirements 10.4**

**Property 35: Pre-Destruction Resource List**
*For any* stack destruction, a list of resources to be deleted should be displayed before proceeding with deletion.
**Validates: Requirements 10.5**

### Example-Based Tests

The following specific examples should be tested with unit tests:

**Example 1: API Docs Site Deployment**
Deploy the API Docs site with source directory `docs/api/` and verify infrastructure is created correctly.
**Validates: Requirements 2.1**

**Example 2: Demo Site Deployment**
Deploy the Demo site with source directory `demo/dist/` and verify infrastructure is created correctly.
**Validates: Requirements 2.2**

**Example 3: Example Site Deployment**
Deploy the Example site with source directory `examples/genesis-ai/dist/` and verify infrastructure is created correctly.
**Validates: Requirements 2.3**

**Example 4: API Docs Build Command**
Execute `npm run docs` and verify build artifacts are generated in `docs/api/`.
**Validates: Requirements 3.1**

**Example 5: Demo Build Command**
Execute `npm run build:demo` and verify build artifacts are generated in `demo/dist/`.
**Validates: Requirements 3.2**

**Example 6: Example Build Command**
Execute `npm run build` in `examples/genesis-ai/` directory and verify build artifacts are generated in `examples/genesis-ai/dist/`.
**Validates: Requirements 3.3**

**Example 7: Default CloudFront Domain**
Deploy a site without custom domain configuration and verify it uses the default CloudFront domain (*.cloudfront.net).
**Validates: Requirements 4.4**

**Example 8: CDK CLI Support**
Execute `cdk synth`, `cdk diff`, and `cdk deploy` commands and verify they complete successfully.
**Validates: Requirements 6.1**

**Example 9: Destruction Confirmation Prompt**
Execute `cdk destroy` and verify a confirmation prompt is displayed before deletion proceeds.
**Validates: Requirements 10.2**


## Error Handling

### Build Errors

**Scenario**: Build command fails (npm run docs, npm run build:demo, etc.)

**Handling**:
1. Capture stdout and stderr from build process
2. Display complete error output to user
3. Exit with non-zero status code
4. Do NOT proceed to CDK deployment
5. Provide suggestion to fix build errors before retrying

**Example Error Message**:
```
❌ Build failed for API Docs site
Command: npm run docs
Exit code: 1

Error output:
[build error details...]

Please fix the build errors and try again.
```

### CDK Synthesis Errors

**Scenario**: CDK stack synthesis fails (invalid configuration, missing dependencies, etc.)

**Handling**:
1. Display CDK error message
2. Highlight the specific construct or configuration causing the issue
3. Suggest configuration fixes if applicable
4. Exit before attempting deployment

**Example Error Message**:
```
❌ CDK synthesis failed
Stack: DeploymentStack
Error: Certificate ARN is required when using custom domain

Configuration issue:
  Site: demo
  Domain: demo.dosage.dev
  Certificate: undefined

Please provide a certificate ARN in your configuration.
```

### AWS API Errors

**Scenario**: AWS API call fails during deployment (permissions, quota limits, resource conflicts, etc.)

**Handling**:
1. Display AWS error code and message
2. Show affected resource name and type
3. Provide troubleshooting suggestions based on error type
4. Allow CDK to handle rollback automatically

**Common AWS Errors**:
- **AccessDenied**: Suggest checking IAM permissions
- **LimitExceeded**: Suggest requesting quota increase
- **ResourceAlreadyExists**: Suggest using different resource names or cleaning up existing resources
- **InvalidParameterValue**: Suggest checking configuration values

**Example Error Message**:
```
❌ Deployment failed
Resource: ApiDocsBucket
Type: AWS::S3::Bucket
Error: AccessDenied - User is not authorized to perform: s3:CreateBucket

Troubleshooting:
- Verify your AWS credentials are configured correctly
- Ensure your IAM user/role has s3:CreateBucket permission
- Check if there are any SCPs blocking bucket creation
```

### Invalidation Errors

**Scenario**: CloudFront invalidation fails after successful S3 upload

**Handling**:
1. Log the invalidation error
2. Display warning (not fatal error)
3. Keep S3 content uploaded
4. Suggest manual invalidation as workaround
5. Continue with deployment completion

**Example Error Message**:
```
⚠️  CloudFront invalidation failed
Distribution: E1234ABCD5678
Error: TooManyInvalidationsInProgress

The content has been uploaded to S3 successfully.
Users may see cached content until the cache expires or you manually invalidate.

To manually invalidate:
aws cloudfront create-invalidation --distribution-id E1234ABCD5678 --paths "/*"
```

### Configuration Validation Errors

**Scenario**: Invalid configuration values provided

**Handling**:
1. Validate all configuration before synthesis
2. Display all validation errors at once (not one at a time)
3. Show expected format/values for each invalid field
4. Exit before attempting synthesis

**Example Error Message**:
```
❌ Configuration validation failed

Invalid configuration values:
  1. sites.demo.domainName: "invalid domain!"
     Expected: Valid domain name (e.g., demo.example.com)
  
  2. region: "invalid-region"
     Expected: Valid AWS region (e.g., us-east-1, eu-west-1)
  
  3. sites.apiDocs.certificateArn: "arn:aws:acm:us-west-2:..."
     Expected: Certificate must be in us-east-1 for CloudFront

Please fix these errors and try again.
```

### Missing Build Artifacts

**Scenario**: Build output directory doesn't exist or is empty

**Handling**:
1. Check if output directory exists
2. If missing, suggest running build command
3. If empty, suggest checking build configuration
4. Provide exact command to run

**Example Error Message**:
```
❌ Build artifacts not found
Site: Demo
Expected directory: demo/dist/
Status: Directory does not exist

Please run the build command first:
npm run build:demo

Then retry deployment.
```

## Testing Strategy

### Overview

The testing strategy employs a dual approach combining unit tests for specific examples and edge cases with property-based tests for universal correctness properties. This ensures both concrete behavior validation and comprehensive coverage across all possible inputs.

### Property-Based Testing

**Framework**: [fast-check](https://github.com/dubzzz/fast-check) for TypeScript

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with feature name and property number
- Tag format: `Feature: aws-cdk-deployment, Property N: [property description]`

**Test Organization**:
```
test/
├── properties/
│   ├── infrastructure.property.test.ts    # Properties 1-6
│   ├── build-deployment.property.test.ts  # Properties 7-8
│   ├── domain-config.property.test.ts     # Properties 9-11
│   ├── cost-optimization.property.test.ts # Properties 12-14
│   ├── automation.property.test.ts        # Properties 15-17
│   ├── invalidation.property.test.ts      # Properties 18-22
│   ├── configuration.property.test.ts     # Properties 23-27
│   ├── error-handling.property.test.ts    # Properties 28-31
│   └── cleanup.property.test.ts           # Properties 32-35
└── examples/
    ├── site-deployment.test.ts            # Examples 1-3
    ├── build-commands.test.ts             # Examples 4-6
    └── cdk-cli.test.ts                    # Examples 7-9
```

**Property Test Example**:
```typescript
// Feature: aws-cdk-deployment, Property 1: S3 Bucket Creation with Security Configuration
describe('Property 1: S3 Bucket Creation', () => {
  it('should create S3 buckets with security configuration for any site', () => {
    fc.assert(
      fc.property(
        fc.record({
          siteName: fc.string({ minLength: 1, maxLength: 20 }),
          sourceDir: fc.string({ minLength: 1 }),
          domainName: fc.option(fc.domain()),
        }),
        async (siteConfig) => {
          // Deploy site with generated config
          const stack = new DeploymentStack(app, 'TestStack', {
            apiDocsConfig: { enabled: true, ...siteConfig }
          });
          
          // Synthesize and check template
          const template = Template.fromStack(stack);
          
          // Verify S3 bucket has security configuration
          template.hasResourceProperties('AWS::S3::Bucket', {
            PublicAccessBlockConfiguration: {
              BlockPublicAcls: true,
              BlockPublicPolicy: true,
              IgnorePublicAcls: true,
              RestrictPublicBuckets: true,
            },
            BucketEncryption: {
              ServerSideEncryptionConfiguration: [{
                ServerSideEncryptionByDefault: {
                  SSEAlgorithm: 'AES256'
                }
              }]
            }
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**Generators for Property Tests**:
- **Site Configuration**: Random site names, source directories, optional domains
- **Domain Names**: Valid domain formats, subdomains, apex domains
- **AWS Regions**: Valid AWS region codes
- **Build Outputs**: Random file structures with HTML/CSS/JS files
- **Configuration Objects**: Valid and invalid configuration combinations

### Unit Testing

**Framework**: Jest with AWS CDK assertions library

**Focus Areas**:
1. **Specific Site Deployments**: Test each of the three sites individually
2. **Build Command Execution**: Test each build command with expected outputs
3. **CDK CLI Operations**: Test synth, diff, deploy, destroy commands
4. **Edge Cases**: Empty directories, missing files, invalid domains
5. **Error Conditions**: Build failures, AWS errors, validation failures

**Unit Test Example**:
```typescript
// Example 1: API Docs Site Deployment
describe('API Docs Site Deployment', () => {
  it('should deploy API docs with correct source directory', () => {
    const app = new cdk.App();
    const stack = new DeploymentStack(app, 'TestStack', {
      apiDocsConfig: {
        enabled: true,
        sourceDir: 'docs/api/'
      }
    });
    
    const template = Template.fromStack(stack);
    
    // Verify S3 bucket created
    template.resourceCountIs('AWS::S3::Bucket', 1);
    
    // Verify CloudFront distribution created
    template.resourceCountIs('AWS::CloudFront::Distribution', 1);
    
    // Verify bucket deployment with correct source
    template.hasResourceProperties('Custom::CDKBucketDeployment', {
      SourcePath: Match.stringLikeRegexp('docs/api')
    });
  });
});
```

### Integration Testing

**Approach**: Deploy to real AWS account in test environment

**Test Scenarios**:
1. **Full Deployment**: Deploy all three sites and verify they're accessible
2. **Incremental Updates**: Update one site and verify others unchanged
3. **Custom Domain**: Deploy with custom domain and verify DNS configuration
4. **Cache Invalidation**: Deploy new content and verify cache is invalidated
5. **Cleanup**: Destroy stack and verify all resources removed

**Integration Test Environment**:
- Separate AWS account or isolated region
- Automated cleanup after tests
- Use unique resource names to avoid conflicts
- Mock or skip actual build commands (use pre-built artifacts)

**Integration Test Example**:
```typescript
describe('Full Deployment Integration', () => {
  let stackName: string;
  
  beforeAll(async () => {
    stackName = `test-stack-${Date.now()}`;
    // Deploy stack to AWS
    await execAsync(`cdk deploy ${stackName} --require-approval never`);
  });
  
  afterAll(async () => {
    // Clean up
    await execAsync(`cdk destroy ${stackName} --force`);
  });
  
  it('should deploy all three sites successfully', async () => {
    // Get stack outputs
    const outputs = await getStackOutputs(stackName);
    
    // Verify all distribution URLs are present
    expect(outputs).toHaveProperty('ApiDocsUrl');
    expect(outputs).toHaveProperty('DemoUrl');
    expect(outputs).toHaveProperty('ExampleUrl');
    
    // Verify sites are accessible
    const apiDocsResponse = await fetch(outputs.ApiDocsUrl);
    expect(apiDocsResponse.status).toBe(200);
    
    const demoResponse = await fetch(outputs.DemoUrl);
    expect(demoResponse.status).toBe(200);
    
    const exampleResponse = await fetch(outputs.ExampleUrl);
    expect(exampleResponse.status).toBe(200);
  });
});
```

### Test Coverage Goals

- **Unit Tests**: 80%+ code coverage
- **Property Tests**: All 35 properties implemented
- **Integration Tests**: All critical user workflows
- **Example Tests**: All 9 specific examples

### Continuous Integration

**CI Pipeline**:
1. Run unit tests on every commit
2. Run property tests on every commit
3. Run integration tests on pull requests to main
4. Generate coverage reports
5. Fail build if coverage drops below threshold

**Test Execution Time**:
- Unit tests: < 30 seconds
- Property tests: < 2 minutes (100 iterations × ~35 properties)
- Integration tests: < 10 minutes (actual AWS deployment)

### Mocking Strategy

**What to Mock**:
- AWS SDK calls in unit tests (use aws-sdk-mock or CDK assertions)
- File system operations for build artifact validation
- External network calls in unit tests

**What NOT to Mock**:
- CDK construct synthesis (test actual CloudFormation templates)
- Integration tests (use real AWS resources)
- Property-based test generators (use real random data)

### Test Data Management

**Build Artifacts**:
- Create fixture directories with sample HTML/CSS/JS files
- Use different fixtures for different test scenarios
- Keep fixtures minimal (small file sizes)

**Configuration Files**:
- Create sample cdk.json files for different scenarios
- Test with valid and invalid configurations
- Include edge cases (empty values, missing fields, etc.)

**AWS Resources**:
- Use unique naming with timestamps to avoid conflicts
- Tag all test resources for easy identification
- Implement automatic cleanup for orphaned resources
