import { PrismaClient } from '@prisma/client';
import * as AWS from 'aws-sdk';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Load the RDS credentials from Secrets Manager
const secretsManager = new AWS.SecretsManager();

let dbConfig: any;

const loadDBConfig = async () => {
  if (!dbConfig) {
    const secret = await secretsManager
      .getSecretValue({ SecretId: 'RDSPostgresCredentials' })
      .promise();
    dbConfig = JSON.parse(secret.SecretString || '{}');
    const { username, password } = dbConfig;

    // Set the DATABASE_URL environment variable for Prisma
    process.env.DATABASE_URL = `postgresql://${username}:${password}@<RDS_ENDPOINT>:5432/postgres`;
  }
};

export const handler = async (event: any): Promise<any> => {
  await loadDBConfig(); // Load DB config if not already done
  console.log('Event received:', JSON.stringify(event));
  const method = event.httpMethod;

  try {
    switch (method) {
      case 'POST':
        return createItem(event);
      case 'GET':
        return getItems();
      case 'PUT':
        return updateItem(event);
      case 'DELETE':
        return deleteItem(event);
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Invalid HTTP Method' }),
        };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

const createItem = async (event: any) => {
  const body = JSON.parse(event.body);
  const item = await prisma.item.create({
    data: {
      name: body.name,
    },
  });
  return {
    statusCode: 201,
    body: JSON.stringify(item),
  };
};

const getItems = async () => {
  const items = await prisma.item.findMany();
  return {
    statusCode: 200,
    body: JSON.stringify(items),
  };
};

const updateItem = async (event: any) => {
  const body = JSON.parse(event.body);
  const item = await prisma.item.update({
    where: { id: body.id },
    data: { name: body.name },
  });
  return {
    statusCode: 200,
    body: JSON.stringify(item),
  };
};

const deleteItem = async (event: any) => {
  const id = event.queryStringParameters.id;
  await prisma.item.delete({
    where: { id: parseInt(id) },
  });
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Item deleted' }),
  };
};
