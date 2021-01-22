import * as random from '@pulumi/random';
import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
import { DatabaseSettings } from '.';

export interface WordpressEnvironmentProps {
  prefix?: string;
  instance: DatabaseSettings;
}

export class WordpressEnvironmentVariables extends pulumi.ComponentResource {
  keysTypes = [
    'AUTH_KEY',
    'SECURE_AUTH_KEY',
    'LOGGED_IN_KEY',
    'NONCE_KEY',
    'AUTH_SALT',
    'SECURE_AUTH_SALT',
    'LOGGED_IN_SALT',
    'NONCE_SALT',
  ];

  envs: pulumi.Input<gcp.types.input.cloudrun.ServiceTemplateSpecContainerEnv>[];

  constructor(
    componentName: string,
    args: WordpressEnvironmentProps,
    opts: pulumi.ComponentResourceOptions = {},
  ) {
    super('wordpress:env-vars', componentName, {}, opts);
    const { prefix = '', instance } = args;

    const keys = this.keysTypes.map(k => ({
      name: `${prefix}${k}`,
      value: new random.RandomPassword(k, {
        length: 65,
      }).result,
    }));

    this.envs = [
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
}