#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { FrontendStack } from '../lib/frontend-stack';

const app = new cdk.App();
new FrontendStack(app, 'FrontendStack', {
  env: {
    account: "847759515844",
    region: "us-east-1",
  },
});