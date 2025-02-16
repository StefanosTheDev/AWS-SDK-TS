import * as cdk from 'aws-cdk-lib';
import { VpcStack } from '../lib/vpc-stack';
import { RdsStack } from '../lib/rds-stack';
import { EcsStack3 } from '../lib/ecs-stack';

const app = new cdk.App();

// ✅ Deploy VPC
const vpcStack = new VpcStack(app, 'VpcStack');

// ✅ Deploy RDS (PostgreSQL)
const rdsStack = new RdsStack(
  app,
  'RdsStack3',
  vpcStack.vpc,
  vpcStack.rdsSecurityGroup
);

// ✅ Deploy ECS + Dockerized App
new EcsStack3(
  app,
  'EcsStack3',
  vpcStack.vpc,
  rdsStack.dbInstance.dbInstanceEndpointAddress,
  {} // Empty object for optional StackProps
);
