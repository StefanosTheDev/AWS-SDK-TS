import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkWalkthroughStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a dynamo table
    const table = new dynamodb.Table(this, 'ItemsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING }, // ID is a uniqu identifier.
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // only pay for read and write requests you consume. Good for unpredictable workloadsa
      tableName: 'ItemsTable', // Name the Table ItemsTable
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
