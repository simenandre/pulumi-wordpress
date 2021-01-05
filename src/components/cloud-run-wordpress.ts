import * as pulumi from '@pulumi/pulumi';
import * as random from '@pulumi/random';
import * as gcp from '@pulumi/gcp';
import { MySQLComponent } from './sql';
import { ServiceAccount } from './service-account';

export interface CloudRunWordpressConfig {
  /**
   * Wordpress image
   */
  readonly image: pulumi.Input<string>;

  /**
   * The location of the cloud run instance. eg us-central1
   */
  readonly location: pulumi.Input<string>;

  /**
   * Storage in GB for database.
   * @default 10
   */
  readonly databaseDiskSize?: pulumi.Input<number>;

  /**
   * For Bedrock
   * Domain environment
   */
  readonly wpHome?: pulumi.Input<string>;

  /**
   * For Bedrock
   * Domain environment
   */
  readonly wpSiteUrl?: pulumi.Input<string>;

  /**
   * Extra environment variables
   */
  readonly envs?: pulumi.Input<gcp.types.input.cloudrun.ServiceTemplateSpecContainerEnv>[];
}

const escapeName = (name: string) => {
  name = name.replace(/[^\w\*]/g, '').toLowerCase();
  if (name.length < 8) {
    name = `${name}wordpress`;
  }
  return name.substring(0, 28);
};

export class CloudRunWordpress extends pulumi.ComponentResource {
  readonly service: gcp.cloudrun.Service;
  readonly database: MySQLComponent;
  readonly cloudRunIamMember: gcp.cloudrun.IamMember;
  readonly storageBucket: gcp.storage.Bucket;
  readonly storageBucketIamMember: gcp.storage.BucketIAMMember[];
  readonly serviceAccount: ServiceAccount;

  constructor(
    name: string,
    args: CloudRunWordpressConfig,
    opts: pulumi.ComponentResourceOptions = {},
  ) {
    super('wordpress:cloudrun', name, {}, opts);

    let { envs, ...config }: CloudRunWordpressConfig = {
      databaseDiskSize: 10,
      envs: [],
      ...args,
    };

    this.database = new MySQLComponent(name, {}, { parent: this });

    this.storageBucket = new gcp.storage.Bucket(
      name,
      {
        location: 'eu',
        cors: [
          {
            methods: ['*'],
            origins: ['*'],
          },
        ],
      },
      { parent: this },
    );

    this.serviceAccount = new ServiceAccount(
      name,
      {
        accountId: escapeName(name),
        roles: ['roles/cloudsql.client'],
      },
      { parent: this },
    );

    this.storageBucketIamMember = [
      new gcp.storage.BucketIAMMember(
        `${name}-viewer`,
        {
          bucket: this.storageBucket.name,
          member: 'allUsers',
          role: 'roles/storage.objectViewer',
        },
        { parent: this },
      ),
      new gcp.storage.BucketIAMMember(
        `${name}-service`,
        {
          bucket: this.storageBucket.name,
          member: this.serviceAccount.account.email.apply(s => `serviceAccount:${s}`),
          role: 'roles/storage.objectAdmin',
        },
        { parent: this },
      ),
    ];

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

    const keys = keysTypes.map(
      k =>
        new random.RandomPassword(k, {
          length: 65,
        }),
    );

    const keyEnvs = (prefix: string) =>
      keysTypes.map((k, i) => ({
        name: `${prefix}${k}`,
        value: keys[i].result,
      }));

    const authEnvs = (prefix: string) => [
      {
        name: `${prefix}DB_HOST`,
        value: pulumi.interpolate`localhost:/cloudsql/${this.database.instance.connectionName}`,
      },
      {
        name: `${prefix}DB_NAME`,
        value: this.database.database.name,
      },
      {
        name: `${prefix}DB_USER`,
        value: this.database.user.name,
      },
      {
        name: `${prefix}DB_PASSWORD`,
        value: this.database.user.password,
      },
    ];

    envs = [
      // For vanilla Wordpress
      ...keyEnvs('WORDPRESS_'),
      ...authEnvs('WORDPRESS_'),
      // For Bedrock Wordpress
      ...keyEnvs(''),
      ...authEnvs(''),
      // For vanilla Wordpress
      ...envs,
    ];

    if (config.wpHome) {
      envs.push({
        name: 'WP_HOME',
        value: config.wpHome,
      });
    }
    if (config.wpSiteUrl) {
      envs.push({
        name: 'WP_SITEURL',
        value: config.wpSiteUrl,
      });
    }

    this.service = new gcp.cloudrun.Service(
      name,
      {
        name,
        autogenerateRevisionName: true,
        location: config.location,
        template: {
          metadata: {
            annotations: {
              'autoscaling.knative.dev/maxScale': '5',
              'run.googleapis.com/cloudsql-instances': this.database.instance
                .connectionName,
            },
          },
          spec: {
            containerConcurrency: 80, // TODO: Make configurable.
            serviceAccountName: this.serviceAccount.account.email,
            containers: [
              {
                image: config.image,
                envs: [
                  {
                    name: 'STORAGE_BUCKET',
                    value: this.storageBucket.name,
                  },
                  {
                    name: 'GCP_SERVICE_ACCOUNT',
                    value: this.serviceAccount.key.privateKey,
                  },
                  {
                    name: 'CLOUDSQL_INSTANCE',
                    value: this.database.instance.connectionName,
                  },
                  ...envs,
                ],
              },
            ],
          },
        },
      },
      { parent: this },
    );

    this.cloudRunIamMember = new gcp.cloudrun.IamMember(
      name,
      {
        service: this.service.name,
        location: config.location,
        role: 'roles/run.invoker',
        member: 'allUsers',
      },
      { parent: this },
    );
  }
}
