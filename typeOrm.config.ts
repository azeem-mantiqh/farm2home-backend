import * as AWS from '@aws-sdk/client-secrets-manager';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config();

async function getSecrets() {
  const secretsManager = new AWS.SecretsManager({
    region: process.env.AWS_REGION ?? 'ap-south-1',
  });

  const secret = await secretsManager.getSecretValue({
    SecretId: process.env.SECRET_ID,
  });

  if (!secret?.SecretString) {
    throw new Error('Failed to retrieve secret string');
  }

  return JSON.parse(secret.SecretString);
}

async function createDataSource(): Promise<DataSource> {
  let secrets;

  if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'dev') secrets = await getSecrets();

  return new DataSource({
    type: 'postgres',
    port: parseInt(secrets?.DB_PORT) || Number(process.env.DB_PORT),
    host: secrets?.DB_HOST || process.env.DB_HOST,
    username: secrets?.DB_USER || process.env.DB_USER,
    password: secrets?.DB_PASSWORD || process.env.DB_PASSWORD,
    database: secrets?.DB_NAME || process.env.DB_NAME,
    schema: secrets?.DB_SCHEMA || process.env.DB_SCHEMA,
    entities: [],
    migrations: [],
  });
}

export default createDataSource();
