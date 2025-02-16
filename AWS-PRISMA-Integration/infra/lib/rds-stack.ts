import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
export class RdsStack extends cdk.Stack {
  public readonly dbInstance: rds.DatabaseInstance;

  constructor(
    scope: Construct,
    id: string,
    vpc: ec2.Vpc,
    securityGroup: ec2.SecurityGroup,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    // Create PostgreSQL RDS instance with a valid version
    this.dbInstance = new rds.DatabaseInstance(this, 'PrismaDB', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_17, // Updated to a supported version
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE3,
        ec2.InstanceSize.MICRO
      ),
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [securityGroup],
      allocatedStorage: 20,
      databaseName: 'prisma_db',
      credentials: rds.Credentials.fromGeneratedSecret('dbadmin'),
    });

    // Export the database endpoint address with a unique name
    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: this.dbInstance.dbInstanceEndpointAddress,

      exportName: 'RdsStack3-PrismaDBEndpoint',
    });
  }
}
