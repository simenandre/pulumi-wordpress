import * as pulumi from '@pulumi/pulumi';
import * as random from '@pulumi/random';
import * as gcp from '@pulumi/gcp';
import { MySQLComponent } from './sql';

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
   * Turn on Wordpress Debug
   */
  readonly wordpressDebug?: pulumi.Input<boolean>;
}

export class CloudRunWordpress extends pulumi.ComponentResource {
  readonly projectServices: gcp.projects.Service[];
  readonly cloudRunService: gcp.cloudrun.Service;
  readonly database: MySQLComponent;
  readonly cloudRunIamMember: gcp.cloudrun.IamMember;
  readonly storageBucket: gcp.storage.Bucket;
  readonly storageBucketIamMember: gcp.storage.BucketIAMMember[];

  private api_services = ['compute.googleapis.com', 'sqladmin.googleapis.com'];

  constructor(
    name: string,
    args: CloudRunWordpressConfig,
    opts: pulumi.ComponentResourceOptions = {},
  ) {
    super('wordpress:cloudrun', name, {}, opts);

    const config: CloudRunWordpressConfig = {
      databaseDiskSize: 10,
      ...args,
    };

    this.projectServices = this.api_services.map(
      service =>
        new gcp.projects.Service(
          `${name}-${service}`,
          {
            service,
            disableOnDestroy: false,
          },
          { parent: this },
        ),
    );

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

    const defServiceAccount = gcp.compute.getDefaultServiceAccount({});

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
          member: defServiceAccount.then(d => `serviceAccount:${d.email}`),
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

    const keyEnvs = keysTypes.map((k, i) => ({
      name: `WORDPRESS_${k}`,
      value: keys[i].result,
    }));

    this.cloudRunService = new gcp.cloudrun.Service(
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
            containers: [
              {
                image: config.image,
                envs: [
                  {
                    name: 'STORAGE_BUCKET',
                    value: this.storageBucket.name,
                  },
                  {
                    name: 'WORDPRESS_DB_HOST',
                    value: pulumi.interpolate`localhost:/cloudsql/${this.database.instance.connectionName}`,
                  },
                  {
                    name: 'DATABASE_URL',
                    value: pulumi.interpolate`mysql:dbname=${this.database.database.name};unix_socket=/cloudsql/${this.database.instance.connectionName}`,
                  },
                  {
                    name: 'WORDPRESS_DB_NAME',
                    value: this.database.database.name,
                  },
                  {
                    name: 'WORDPRESS_DB_USER',
                    value: this.database.user.name,
                  },
                  {
                    name: 'WORDPRESS_DB_PASSWORD',
                    value: this.database.user.password,
                  },
                  {
                    name: 'CLOUDSQL_INSTANCE',
                    value: this.database.instance.connectionName,
                  },
                  {
                    name: 'WORDPRESS_DEBUG',
                    value: config.wordpressDebug ? '1' : '',
                  },
                  ...keyEnvs,
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
        service: this.cloudRunService.name,
        location: config.location,
        role: 'roles/run.invoker',
        member: 'allUsers',
      },
      { parent: this },
    );
  }
}
