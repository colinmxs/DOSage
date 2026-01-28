# AWS CDK Multi-Site Deployment

Deploy multiple static sites to AWS with CloudFront and S3 using AWS CDK. All sites are served from a single CloudFront distribution with path-based routing.

## Quick Start

### Option 1: GitHub Actions (Recommended)

Automated deployment on push to main branch.

1. **Follow the setup guide:** [.github/workflows/SETUP.md](../.github/workflows/SETUP.md)
2. **Configure GitHub Secrets and Variables**
3. **Push to main branch** - deployment happens automatically!

### Option 2: Manual Deployment

1. **Install dependencies:**
```bash
npm install
```

2. **Configure your deployment** in `cdk.json`:
```json
{
  "context": {
    "deployment": {
      "region": "us-east-1",
      "domainName": "your-domain.com",
      "certificateArn": "arn:aws:acm:us-east-1:123456789012:certificate/your-cert-id",
      "sites": {
        "apiDocs": {
          "enabled": true,
          "pathPattern": "/docs/*",
          "sourceDir": "../docs/api/"
        },
        "demo": {
          "enabled": true,
          "pathPattern": "/demo/*",
          "sourceDir": "../demo/dist/"
        },
        "example": {
          "enabled": true,
          "pathPattern": "/examples/*",
          "sourceDir": "../examples/genesis-ai/dist/"
        }
      }
    }
  }
}
```

3. **Deploy:**
```bash
npm run cdk deploy
```

## Architecture

All sites are served from a single domain with path-based routing:
- `example.com/docs/*` → API Documentation
- `example.com/demo/*` → Demo Site
- `example.com/examples/*` → Example Projects

**Benefits:**
- Single CloudFront distribution (lower cost)
- One SSL certificate
- Simpler DNS setup
- All sites under one domain

## Configuration

### GitHub Actions (Automated)

Configuration is managed through GitHub Secrets and Variables:

**Secrets (Settings → Secrets and variables → Actions → Secrets):**
- `AWS_ROLE_ARN` - IAM role ARN for OIDC authentication
- `AWS_ACCOUNT_ID` - Your AWS account ID
- `CDK_CERTIFICATE_ARN` - ACM certificate ARN (us-east-1)

**Variables (Settings → Secrets and variables → Actions → Variables):**
- `AWS_REGION` - AWS region (default: us-east-1)
- `CDK_DOMAIN_NAME` - Your domain name

Site configurations are still managed in `cdk.json`.

### Manual Deployment

### Required Settings
- `region` - AWS region (must be us-east-1 for CloudFront certificates)
- `domainName` - Your domain name
- `certificateArn` - ACM certificate ARN (must be in us-east-1)
- `sites` - Configuration for each site (apiDocs, demo, example)

### Optional Settings
- `logging.enabled` - Enable CloudFront access logs (default: true)
- `logging.retentionDays` - Log retention period (default: 30)
- `priceClass` - CloudFront price class (default: PRICE_CLASS_100)
- `defaultRootObject` - Default root object (default: index.html)

## Commands

```bash
# Deploy with automatic builds
npm run cdk deploy

# Force rebuild before deploy
npm run cdk deploy -- --rebuild

# Skip builds (use existing artifacts)
npm run cdk deploy -- --skip-build

# Preview changes
npm run cdk diff

# Destroy stack
npm run cdk destroy
```

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** configured with credentials
3. **ACM Certificate** in us-east-1 region
4. **Build artifacts** in the specified source directories

## SSL Certificate Setup

CloudFront requires certificates in **us-east-1** region:

```bash
# Request certificate in us-east-1
aws acm request-certificate \
  --domain-name your-domain.com \
  --validation-method DNS \
  --region us-east-1
```

## DNS Configuration

After deployment, configure DNS:

```
your-domain.com  CNAME  d111111abcdef8.cloudfront.net
```

## Cost Estimates

**Monthly costs (assuming low traffic):**
- CloudFront: ~$1-5/month (single distribution)
- S3 Storage: ~$0.50/month (20GB)
- **Total: ~$2-6/month**

## Troubleshooting

### Certificate not found
Ensure certificate is in **us-east-1** region.

### Build artifacts missing
Run builds manually:
```bash
npm run docs
npm run build:demo
cd examples/genesis-ai && npm run build
```

### Permission denied
Ensure AWS credentials have permissions for:
- S3 (CreateBucket, PutObject)
- CloudFront (CreateDistribution, CreateInvalidation)
- ACM (DescribeCertificate)

### Stack deletion fails
Empty S3 buckets are auto-deleted. If manual deletion needed:
```bash
aws s3 rm s3://bucket-name --recursive
```

## Architecture

```
┌─────────────────────────────────────┐
│     CloudFront Distribution         │
│  (HTTPS, Caching, Compression)      │
└─────────────────────────────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───▼───┐   ┌───▼───┐   ┌───▼───┐
│ Docs  │   │ Demo  │   │Example│
│Bucket │   │Bucket │   │Bucket │
└───────┘   └───────┘   └───────┘
```

## Features

- ✅ HTTPS enforcement
- ✅ CloudFront CDN
- ✅ Automatic cache invalidation
- ✅ Access logging
- ✅ Cost optimization
- ✅ SPA routing support
- ✅ Build integration

## License

MIT
