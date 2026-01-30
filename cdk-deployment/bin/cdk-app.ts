#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DeploymentStack } from '../lib/deployment-stack';

const app = new cdk.App();

const domainName = app.node.tryGetContext('domainName');
const certificateArn = app.node.tryGetContext('certificateArn');
const region = app.node.tryGetContext('region') || 'us-west-2';

console.log('CDK Context Values:');
console.log('domainName:', domainName);
console.log('certificateArn:', certificateArn);
console.log('region:', region);

if (!domainName) {
  throw new Error('domainName context is required');
}

if (!certificateArn) {
  throw new Error('certificateArn context is required');
}

new DeploymentStack(app, 'DeploymentStack', {
  domainName,
  certificateArn,
  env: {
    region,
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
});

app.synth();
