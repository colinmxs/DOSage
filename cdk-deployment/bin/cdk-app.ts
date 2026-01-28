#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DeploymentStack } from '../lib/deployment-stack';

/**
 * CDK Application Entry Point
 * 
 * Initializes the CDK app and creates the deployment stack.
 * Configuration is loaded from cdk.json context or environment variables.
 */

const app = new cdk.App();

new DeploymentStack(app, 'DeploymentStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
});

app.synth();
