import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
import * as docker from '@pulumi/docker';

export interface GCRDockerArgs {
  name?: string;
  tag?: string;
  build: string;
}

export class GCRDocker extends pulumi.ComponentResource {
  readonly image: docker.Image;

  constructor(
    componentName: string,
    args: GCRDockerArgs,
    opts: pulumi.ComponentResourceOptions = {},
  ) {
    super('wordpress:gcr-docker', componentName, {}, opts);

    const { name = componentName, tag, build } = args;

    const image = gcp.container.getRegistryImage(
      {
        name,
        tag,
      },
      {
        parent: this,
      },
    );

    this.image = new docker.Image(
      `${name}-docker-image`,
      {
        imageName: image.then(i => i.imageUrl),
        build,
      },
      {
        parent: this,
      },
    );
  }
}
