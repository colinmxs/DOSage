import { Stack, StackProps, CfnOutput, RemovalPolicy, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as iam from 'aws-cdk-lib/aws-iam';

export interface DeploymentStackProps extends StackProps {
  domainName: string;
  certificateArn: string;
}

export class DeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props: DeploymentStackProps) {
    super(scope, id, props);

    // S3 Bucket
    const bucket = new s3.Bucket(this, 'SiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Origin Access Control
    const oac = new cloudfront.S3OriginAccessControl(this, 'OAC', {
      signing: cloudfront.Signing.SIGV4_NO_OVERRIDE,
    });

    // CloudFront Distribution
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket, {
          originAccessControl: oac,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        compress: true,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      domainNames: [props.domainName],
      certificate: acm.Certificate.fromCertificateArn(this, 'Certificate', props.certificateArn),
      defaultRootObject: 'index.html',
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
    });

    // S3 Bucket Policy for CloudFront
    bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['s3:GetObject'],
        principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
        resources: [bucket.arnForObjects('*')],
        conditions: {
          StringEquals: {
            'AWS:SourceArn': `arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`
          }
        }
      })
    );

    // Add ListBucket permission for better error handling
    bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['s3:ListBucket'],
        principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
        resources: [bucket.bucketArn],
        conditions: {
          StringEquals: {
            'AWS:SourceArn': `arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`
          }
        }
      })
    );

    // Route53 Record
    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: props.domainName,
    });

    new route53.ARecord(this, 'AliasRecord', {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    });

    // Deploy Sites
    // Landing page (root)
    new s3deploy.BucketDeployment(this, 'LandingDeployment', {
      sources: [s3deploy.Source.asset('../landing/dist')],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*'],
      prune: true,
    });

    // API Docs
    new s3deploy.BucketDeployment(this, 'DocsDeployment', {
      sources: [s3deploy.Source.asset('../docs/api')],
      destinationBucket: bucket,
      destinationKeyPrefix: 'docs/',
      distribution,
      distributionPaths: ['/docs/*'],
      prune: true,
    });

    // Demo
    new s3deploy.BucketDeployment(this, 'DemoDeployment', {
      sources: [s3deploy.Source.asset('../demo/dist')],
      destinationBucket: bucket,
      destinationKeyPrefix: 'demo/',
      distribution,
      distributionPaths: ['/demo/*', '/demo/index.html', '/demo/assets/*'],
      prune: true,
    });

    // Genesis AI Example
    new s3deploy.BucketDeployment(this, 'ExampleDeployment', {
      sources: [s3deploy.Source.asset('../examples/genesis-ai/dist')],
      destinationBucket: bucket,
      destinationKeyPrefix: 'examples/genesis-ai/',
      distribution,
      distributionPaths: ['/examples/*'],
      prune: true,
    });

    // Outputs
    new CfnOutput(this, 'DistributionUrl', {
      value: `https://${distribution.distributionDomainName}`,
    });

    new CfnOutput(this, 'DomainUrl', {
      value: `https://${props.domainName}`,
    });

    new CfnOutput(this, 'BucketName', {
      value: bucket.bucketName,
    });
  }
}