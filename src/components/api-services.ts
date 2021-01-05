import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';

export interface ApiServicesConfig {
  /**
   * Other services to activate
   */
  readonly services?: pulumi.Input<string>[];

  /**
   * Include default services
   * @default true
   */
  readonly includeDefault?: pulumi.Input<boolean>;
}

export class ApiServices extends pulumi.ComponentResource {
  readonly services: gcp.projects.Service[];

  private api_services = [
    'compute.googleapis.com',
    'sqladmin.googleapis.com',
    'containerregistry.googleapis.com',
    'run.googleapis.com',
  ];

  constructor(
    name: string,
    args: ApiServicesConfig,
    opts: pulumi.ComponentResourceOptions = {},
  ) {
    super('wordpress:api-services', name, {}, opts);

    let { services = [], includeDefault = true } = args;

    if (includeDefault) {
      services = [...services, ...this.api_services];
    }

    this.services = services.map(
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
  }
}
