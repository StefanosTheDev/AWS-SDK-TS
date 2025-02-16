import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class EcsStack3 extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    vpc: ec2.Vpc,
    dbEndpoint: string,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    // ✅ Create ECS Cluster
    const cluster = new ecs.Cluster(this, 'PrismaCluster2', { vpc });

    // ✅ Task Execution Role
    const executionRole = new iam.Role(this, 'ExecutionRole2', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AmazonECSTaskExecutionRolePolicy'
        ),
      ],
    });

    // ✅ Task Definition
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'PrismaTask2', {
      memoryLimitMiB: 512,
      cpu: 256,
      executionRole: executionRole,
    });

    // ✅ Container (HARD-CODED DB URL JUST TO SEE IT WORK)
    taskDefinition.addContainer('PrismaApp2', {
      image: ecs.ContainerImage.fromRegistry(
        '268572651977.dkr.ecr.us-west-1.amazonaws.com/my-prisma-app:latest'
      ),
      memoryLimitMiB: 512,
      cpu: 256,
      environment: {
        DATABASE_URL:
          'postgresql://admin:password@rds-instance-url:5432/prisma_db', // HARDCODED
      },
      portMappings: [{ containerPort: 3000 }],
    });

    // ✅ Deploy Fargate Service
    new ecs.FargateService(this, 'PrismaService2', {
      cluster,
      taskDefinition,
      desiredCount: 1,
      assignPublicIp: true, // ✅ Ensures it's reachable
    });

    // ✅ Output Instructions
    new cdk.CfnOutput(this, 'RetrieveFargateTaskIP2', {
      value: `Run 'aws ecs list-tasks --cluster PrismaCluster2' followed by 'aws ecs describe-tasks --cluster PrismaCluster2 --tasks <task_id>' to get the public IP`,
    });
  }
}
