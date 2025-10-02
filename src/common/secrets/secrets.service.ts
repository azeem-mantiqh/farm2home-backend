import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import * as AWS from '@aws-sdk/client-secrets-manager';

@Injectable()
export class SecretsService {
  private secretsMap: Record<string, string> = {};
  constructor() {
    this.initializeSecrets();
  }

  private async initializeSecrets() {
    try {
      const secretsManager = new AWS.SecretsManager({
        region: process.env.AWS_REGION ?? 'ap-south-1',
      });
      if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'dev') {
        const fetchedSecrets = await secretsManager.getSecretValue({
          SecretId: process.env.SECRET_ID,
        });

        if (!fetchedSecrets.SecretString) {
          Logger.log('SecretString is empty');
        }

        if (!fetchedSecrets.SecretString) {
          return;
        }

        const parsedSecrets = JSON.parse(fetchedSecrets.SecretString) as {
          [key: string]: string;
        };

        for (const [key, value] of Object.entries(parsedSecrets)) {
          this.secretsMap[key] = value;
        }
      }
    } catch (err) {
      Logger.debug(`${process.env.NODE_ENV} ENV file loaded`);
      console.debug(err);
    }
  }

  getSecret(key: string): string | undefined {
    return this.secretsMap[key] ?? process.env[key];
  }
}
