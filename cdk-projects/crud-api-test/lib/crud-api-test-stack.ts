import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

export class CrudLambdaRdsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a VPC for RDS
    const vpc = new ec2.Vpc(this, 'PostgresVpc', {
      maxAzs: 2, // Use 2 Availability Zones for redundancy
    });

    // Create a secret for RDS credentials
    const dbCredentialsSecret = new secretsmanager.Secret(
      this,
      'DBCredentialsSecret',
      {
        secretName: 'RDSPostgresCredentials',
        generateSecretString: {
          secretStringTemplate: JSON.stringify({ username: 'postgres' }),
          excludePunctuation: true,
          includeSpace: false,
          generateStringKey: 'password',
        },
      }
    );

    // Create the RDS PostgreSQL instance
    const rdsInstance = new rds.DatabaseInstance(this, 'PostgresInstance', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_14,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE2,
        ec2.InstanceSize.MICRO
      ), // Free-tier eligible
      vpc,
      credentials: rds.Credentials.fromSecret(dbCredentialsSecret),
      multiAz: false,
      allocatedStorage: 20,
      maxAllocatedStorage: 100,
      allowMajorVersionUpgrade: false,
      autoMinorVersionUpgrade: true,
      backupRetention: cdk.Duration.days(7),
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Destroy database on stack deletion (for dev purposes)
      deleteAutomatedBackups: true,
      publiclyAccessible: true,
    });

    // Output the RDS endpoint and secret
    new cdk.CfnOutput(this, 'RDSPostgresEndpoint', {
      value: rdsInstance.dbInstanceEndpointAddress,
    });

    new cdk.CfnOutput(this, 'RDSPostgresSecret', {
      value: dbCredentialsSecret.secretName,
    });
  }
}
