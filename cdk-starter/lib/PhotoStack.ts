import * as cdk from 'aws-cdk-lib';
import { Bucket, CfnBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class PhotoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const myBucket = new Bucket(this, 'PhotosBucket2', {
      bucketName: 'photosbucket-234kabj34',
    });

    (myBucket.node.defaultChild as CfnBucket).overrideLogicalId(
      'PhotosBucketStefanos'
    );

    // create a new resource

    // delete the old one.
  }
}
