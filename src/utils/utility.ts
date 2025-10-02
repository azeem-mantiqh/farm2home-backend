import * as crypto from 'crypto';

export const generateSecretHash = (username: string, clientId: string, clientSecret: string): string => {
  return crypto
    .createHmac('SHA256', clientSecret)
    .update(username + clientId)
    .digest('base64');
};
