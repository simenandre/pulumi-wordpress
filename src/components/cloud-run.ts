import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
import { ServiceAccount } from './service-account';
import { DatabaseSettings } from './sql';
import { createEnvironmentVariables } from '../libs/env-vars';
import { escapeName } from '../libs/utils';

export interface CloudRunConfig {
  /**
   * image
   */
  readonly image: pulumi.Input<string>;

  /**
   * domain
   */
  readonly domain?: pulumi.Input<string>;

  /**
   * The location of the cloud run instance. eg us-central1
   */
  readonly location: pulumi.Input<string>;

  /**
   * Extra environment variables
   */
  readonly envs?: pulumi.Input<gcp.types.input.cloudrun.ServiceTemplateSpecContainerEnv>[];

  /**
   * SQL Database Settings
   * Adding this will activate Cloud SQL and environment variables.
   */
  readonly databaseSettings?: DatabaseSettings;

  /**
   * Maximum Scaling
   */
  readonly maxScale?: pulumi.Input<number>;

  /**
   * Minimum Scaling (beta)
   */
  readonly minScale?: pulumi.Input<number>;

  /**
   * Environment variable prefix
   * E.g. if you set `HELLO_`, DB_HOST becomes HELLO_DB_HOST.
   */
  readonly dbEnvironmentPrefix?: pulumi.Input<string>;

  /**
   * Container Concurrency
   * @default 80
   */
  readonly containerConcurrency?: pulumi.Input<number>;
}

export class CloudRun extends pulumi.ComponentResource {
  readonly service: gcp.cloudrun.Service;
  readonly domainMapping: gcp.cloudrun.DomainMapping;
  readonly cloudRunIamMember: gcp.cloudrun.IamMember;
  readonly storageBucket: gcp.storage.Bucket;
  readonly storageBucketIamMember: gcp.storage.BucketIAMMember[];
  readonly serviceAccount: ServiceAccount;

  constructor(
    name: string,
    args: CloudRunConfig,
    opts: pulumi.ComponentResourceOptions = {},
  ) {
    super('wordpress:cloudrun', name, {}, opts);

    let {
      envs = [],
      databaseSettings,
      containerConcurrency = 20,
      maxScale = 5,
      minScale = 0,
      domain,
      ...config
    } = args;

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
      { parent: this, protected: true },
    );

    this.serviceAccount = new ServiceAccount(
      name,
      {
        accountId: escapeName(`sa-${name}`),
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
          member: this.serviceAccount.account.email.apply(
            s => `serviceAccount:${s}`,
          ),
          role: 'roles/storage.objectAdmin',
        },
        { parent: this },
      ),
    ];

    const annotations = {
      'autoscaling.knative.dev/maxScale': String(maxScale),
      'autoscaling.knative.dev/minScale': String(minScale),
    };

    if (databaseSettings) {
      annotations['run.googleapis.com/cloudsql-instances'] =
        databaseSettings.connectionName;
      envs.push({
        name: 'CLOUDSQL_INSTANCE',
        value: databaseSettings.connectionName,
      });
      envs.push(
        ...createEnvironmentVariables({
          instance: databaseSettings,
        }),
      );
    }

    this.service = new gcp.cloudrun.Service(
      name,
      {
        name,
        autogenerateRevisionName: true,
        location: config.location,
        template: {
          metadata: {
            annotations,
          },
          spec: {
            containerConcurrency,
            serviceAccountName: this.serviceAccount.account.email,
            containers: [
              {
                image: config.image,
                envs: [
                  {
                    name: 'STORAGE_BUCKET',
                    value: this.storageBucket.name,
                  },
                  // TODO: Service account should be moved
                  {
                    name: 'GCP_SERVICE_ACCOUNT',
                    value: this.serviceAccount.key.privateKey,
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

    if (domain) {
      const project = gcp.organizations.getProject(undefined, { parent: this });

      this.domainMapping = new gcp.cloudrun.DomainMapping(
        name,
        {
          location: config.location,
          metadata: {
            namespace: project.then(p => p.projectId),
          },
          name: domain,
          spec: { routeName: this.service.name },
        },
        { parent: this },
      );
    }

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
