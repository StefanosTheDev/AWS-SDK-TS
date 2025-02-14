#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { HelloWorldLambdaStack } from '../lib/hello-world-lambda-stack';

const app = new cdk.App();
new HelloWorldLambdaStack(app, 'HelloWorldLambdaStack', {});
