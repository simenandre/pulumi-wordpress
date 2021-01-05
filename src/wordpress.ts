import * as pulumi from '@pulumi/pulumi';
import { ApiServices, CloudRunWordpress, GCRDocker } from './components';

export interface WordpressArgs {
  /**
   * Domain for this project
   */
  readonly domain: string;
  /**
   * Database storage in gigabytes (minimum 10)
   * @default 10
   */
  readonly databaseDiskSize?: number;
  /**
   * Activate backups (automated database backups)
   */
  readonly activateBackups?: boolean;
  /**
   * Size of project
   * Used for setting up sensible defaults
   * @default small
   */
  readonly size: 'small' | 'medium' | 'large';
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
}


export class Wordpress extends pulumi.ComponentResource {
  readonly apiServices: ApiServices;
  readonly gcrDocker: GCRDocker;
  readonly service: CloudRunWordpress;

  constructor(
    name: string,
    args: WordpressArgs,
    opts: pulumi.ComponentResourceOptions = {},
  ) {
    super('wordpress', name, args, opts);

    const { build = '../site', location, databaseDiskSize } = args;

    this.apiServices = new ApiServices(name, {});

    this.gcrDocker = new GCRDocker(
      name,
      {
        build,
      },
      { parent: this, dependsOn: this.apiServices },
    );

    this.service = new CloudRunWordpress(name, {
      image: this.gcrDocker.image.imageName,
      location,
      databaseDiskSize,
    });
  }
}
