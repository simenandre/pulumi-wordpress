import * as k8s from '@pulumi/kubernetes';
import * as pulumi from '@pulumi/pulumi';
import { ServiceAccount } from './service-account';

export interface WordpressDeploymentArgs {
  env?: pulumi.Input<k8s.types.input.core.v1.EnvVar[]>;
  image: pulumi.Input<string>;
  containerPort?: pulumi.Input<number>;
  servicePort?: pulumi.Input<number>;
  serviceAccount?: pulumi.Input<ServiceAccount>;
  containers?: pulumi.Input<k8s.types.input.core.v1.Container[]>;
}

export class WordpressDeployment extends pulumi.ComponentResource {
  readonly deployment: k8s.apps.v1.Deployment;
  readonly service: k8s.core.v1.Service;
  readonly secret?: k8s.core.v1.Secret;

  constructor(
    name: string,
    {
      env,
      image,
      containerPort = 8000,
      servicePort = 80,
      serviceAccount,
      containers = [],
    }: WordpressDeploymentArgs,
    opts: pulumi.ComponentResourceOptions = {},
  ) {
    super('wordpress:deployment', name, {}, opts);

    if (serviceAccount) {
      this.secret = new k8s.core.v1.Secret(
        name,
        {
          metadata: {
            name,
          },
          data: {
            'credentials.json': pulumi
              .output(serviceAccount)
              .apply(sa => sa.key.privateKey),
          },
        },
        { parent: this },
      );
    }

    const metadata = { name, labels: { service: 'wordpress', app: name } };

    this.deployment = new k8s.apps.v1.Deployment(
      name,
      {
        metadata,
        spec: {
          selector: { matchLabels: { app: name } },
          template: {
            metadata: { labels: { app: name } },
            spec: {
              volumes: this.secret
                ? [
                    {
                      name: 'google-credentials',
                      secret: {
                        secretName: this.secret.metadata.name,
                      },
                    },
                  ]
                : [],
              containers: pulumi.output(containers).apply(containers => [
                {
                  name,
                  env: serviceAccount
                    ? pulumi.output(env).apply(e => [
                        ...e,
                        // TODO: Service account should be moved
                        {
                          name: 'GCP_SERVICE_ACCOUNT',
                          value: pulumi
                            .output(serviceAccount)
                            .apply(sa => sa.key.privateKey),
                        },
                      ])
                    : env,
                  image,
                  ports: [{ containerPort }],
                },
                ...containers,
              ]),
            },
          },
        },
      },
      { parent: this },
    );

    this.service = new k8s.core.v1.Service(
      name,
      {
        metadata,
        spec: {
          ports: [
            { name: 'public', port: servicePort, targetPort: containerPort },
          ],
          selector: { app: name },
        },
      },
      { parent: this },
    );
  }
}
