# GitHub Actions Deployment Setup

This guide walks you through setting up automated CDK deployments using GitHub Actions.

## Prerequisites

1. AWS Account with appropriate permissions
2. ACM Certificate in us-east-1 region
3. GitHub repository with this code

## Step 1: Configure AWS OIDC for GitHub Actions

Instead of using long-lived AWS credentials, we'll use OpenID Connect (OIDC) for secure, temporary credentials.

### Create IAM OIDC Provider

```bash
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

### Create IAM Role

Create a file `github-actions-trust-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:YOUR_GITHUB_ORG/YOUR_REPO:*"
        }
      }
    }
  ]
}
```

Replace:
- `YOUR_ACCOUNT_ID` with your AWS account ID
- `YOUR_GITHUB_ORG/YOUR_REPO` with your GitHub org/username and repository name

Create the role:

```bash
aws iam create-role \
  --role-name GitHubActionsCDKDeployRole \
  --assume-role-policy-document file://github-actions-trust-policy.json
```

### Attach Permissions Policy

Create a file `cdk-deploy-permissions.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cloudformation:*",
        "s3:*",
        "cloudfront:*",
        "acm:DescribeCertificate",
        "acm:GetCertificate",
        "iam:CreateRole",
        "iam:DeleteRole",
        "iam:GetRole",
        "iam:PassRole",
        "iam:AttachRolePolicy",
        "iam:DetachRolePolicy",
        "iam:PutRolePolicy",
        "iam:DeleteRolePolicy",
        "iam:GetRolePolicy",
        "logs:CreateLogGroup",
        "logs:DeleteLogGroup",
        "logs:PutRetentionPolicy",
        "ssm:GetParameter",
        "ssm:PutParameter"
      ],
      "Resource": "*"
    }
  ]
}
```

Attach the policy:

```bash
aws iam put-role-policy \
  --role-name GitHubActionsCDKDeployRole \
  --policy-name CDKDeployPermissions \
  --policy-document file://cdk-deploy-permissions.json
```

## Step 2: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

### Add Secrets

Click "New repository secret" for each:

1. **AWS_ROLE_ARN**
   - Value: `arn:aws:iam::YOUR_ACCOUNT_ID:role/GitHubActionsCDKDeployRole`
   - Get your role ARN: `aws iam get-role --role-name GitHubActionsCDKDeployRole --query 'Role.Arn' --output text`

2. **AWS_ACCOUNT_ID**
   - Value: Your 12-digit AWS account ID
   - Get it: `aws sts get-caller-identity --query Account --output text`

3. **CDK_CERTIFICATE_ARN**
   - Value: Your ACM certificate ARN (must be in us-east-1)
   - Get it: `aws acm list-certificates --region us-east-1`

### Add Variables

Click "Variables" tab, then "New repository variable" for each:

1. **AWS_REGION**
   - Value: `us-east-1` (or your preferred region)

2. **CDK_DOMAIN_NAME**
   - Value: Your domain name (e.g., `example.com`)

## Step 3: Test the Workflow

### Manual Trigger

1. Go to Actions tab in GitHub
2. Select "Deploy CDK Stack" workflow
3. Click "Run workflow"
4. Choose branch and options
5. Click "Run workflow"

### Automatic Trigger

Push to main branch:

```bash
git add .
git commit -m "Setup GitHub Actions deployment"
git push origin main
```

## Step 4: Verify Deployment

After the workflow completes:

1. Check CloudFormation stack in AWS Console
2. Get CloudFront distribution URL from stack outputs
3. Configure DNS to point to CloudFront distribution

## Troubleshooting

### "User is not authorized to perform: sts:AssumeRoleWithWebIdentity"

- Verify the trust policy has correct GitHub org/repo
- Check OIDC provider exists: `aws iam list-open-id-connect-providers`

### "Certificate not found"

- Ensure certificate is in us-east-1 region
- Verify certificate ARN is correct
- Check certificate status: `aws acm describe-certificate --certificate-arn YOUR_ARN --region us-east-1`

### "No sites are enabled"

- Check that at least one site is enabled in `cdk.json`
- Verify build artifacts exist in source directories

### Build failures

- Ensure all dependencies are installed
- Check that build commands work locally
- Review build logs in GitHub Actions

## Optional: Environment-Specific Deployments

To deploy to multiple environments (dev, staging, prod):

1. Create environment-specific secrets/variables in GitHub
2. Modify workflow to use environment:

```yaml
jobs:
  deploy-prod:
    runs-on: ubuntu-latest
    environment: production  # Add this line
    # ... rest of job
```

3. Configure environment protection rules in GitHub Settings → Environments

## Security Best Practices

- ✅ Use OIDC instead of long-lived credentials
- ✅ Apply least-privilege IAM permissions
- ✅ Use environment protection rules for production
- ✅ Enable branch protection on main
- ✅ Require pull request reviews
- ✅ Store sensitive values in GitHub Secrets (not Variables)

## Cost Optimization

- Use workflow_dispatch for manual deployments to avoid unnecessary runs
- Consider caching npm dependencies (already configured)
- Use `skip_build` option when only CDK code changes

## Next Steps

1. Set up DNS records to point to CloudFront
2. Configure environment-specific deployments
3. Add deployment notifications (Slack, email, etc.)
4. Set up monitoring and alerts
