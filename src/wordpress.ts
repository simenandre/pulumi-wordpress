import * as pulumi from '@pulumi/pulumi';
import { ApiServices, CloudRun, GCRDocker, MySQLComponent } from './components';

export interface WordpressArgs {
  /**
   * Domain for this project
   */
  readonly domain: pulumi.Input<string>;

  /**
   * Database storage in gigabytes (minimum 10)
   * @default 10
   */
  readonly databaseDiskSize?: pulumi.Input<number>;

  /**
   * Activate backups (automated database backups)
   */
  readonly enableBackups?: pulumi.Input<boolean>;

  /**
   * The location of the cloud run instance. eg us-central1
   */
  readonly location: pulumi.Input<string>;

  /**
   * Folder where your Dockerfile are
   * located.
   * @default ../site
   */
  readonly build?: string;

  /**
   * Preset
   * @default bedrock
   */
  readonly preset?: 'wordpress' | 'bedrock';
}

const envPrefix: Record<WordpressArgs['preset'], string> = {
  bedrock: '',
  wordpress: 'WORDPRESS_',
};

export class Wordpress extends pulumi.ComponentResource {
  readonly apiServices: ApiServices;
  readonly gcrDocker: GCRDocker;

  readonly service: CloudRun;
  readonly database: MySQLComponent;

  constructor(
    name: string,
    args: WordpressArgs,
    opts: pulumi.ComponentResourceOptions = {},
  ) {
    super('wordpress', name, args, opts);

    const {
      domain,
      build = '../site',
      location,
      databaseDiskSize,
      enableBackups,
      preset = 'bedrock',
    } = args;

    this.apiServices = new ApiServices(name, {}, { parent: this });

    this.gcrDocker = new GCRDocker(
      name,
      {
        build,
      },
      { parent: this, dependsOn: this.apiServices.services },
    );

    this.database = new MySQLComponent(
      name,
      {
        enableBackups,
        diskSize: databaseDiskSize,
      },
      { parent: this, dependsOn: this.apiServices.services },
    );

    this.service = new CloudRun(
      name,
      {
        image: this.gcrDocker.image.imageName,
        location,
        domain,
        dbEnvironmentPrefix: envPrefix[preset],
        databaseSettings: {
          connectionName: this.database.database.instance,
          databaseName: this.database.database.name,
          databaseUsername: this.database.user.name,
          databasePassword: this.database.user.password,
        },
        envs: [
          {
            name: 'WP_HOME',
            value: pulumi.interpolate`https://${domain}/`,
          },
          {
            name: 'WP_SITEURL',
            value: pulumi.interpolate`https://${domain}/wp`,
          },
        ],
      },
      { parent: this, dependsOn: this.apiServices.services },
    );
  }
}
