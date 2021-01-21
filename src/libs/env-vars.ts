import * as random from '@pulumi/random';
import * as pulumi from '@pulumi/pulumi';
import { DatabaseSettings } from '../components';

const keysTypes = [
  'AUTH_KEY',
  'SECURE_AUTH_KEY',
  'LOGGED_IN_KEY',
  'NONCE_KEY',
  'AUTH_SALT',
  'SECURE_AUTH_SALT',
  'LOGGED_IN_SALT',
  'NONCE_SALT',
];

export interface CreateEnvVarsProps {
  prefix?: string;
  instance: DatabaseSettings;
}

export function createEnvironmentVariables(config: CreateEnvVarsProps) {
  const { prefix = '', instance } = config;

  const keys = keysTypes.map(k => ({
    name: `${prefix}${k}`,
    value: (new random.RandomPassword(k, {
      length: 65,
    })).result,
  }));

  return [
    {
      name: `${prefix}DB_HOST`,
      value: pulumi.interpolate`localhost:/cloudsql/${instance.connectionName}`,
    },
    {
      name: `${prefix}DB_NAME`,
      value: instance.databaseName,
    },
    {
      name: `${prefix}DB_USER`,
      value: instance.databaseUsername,
    },
    {
      name: `${prefix}DB_PASSWORD`,
      value: instance.databasePassword,
    },
    ...keys,
  ];
}
