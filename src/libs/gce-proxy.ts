import * as k8s from '@pulumi/kubernetes';
import * as pulumi from '@pulumi/pulumi';

export interface GCPProxyArgs {
  connectionName: pulumi.Input<string>;
  databasePort: pulumi.Input<number>;

  addGoogleCredentials?: pulumi.Input<boolean>;
}

export function createGCEProxy({
  connectionName,
  databasePort,
  addGoogleCredentials = true,
}: GCPProxyArgs): k8s.types.input.core.v1.Container {
  return {
    name: 'gce-proxy',
    image: 'gcr.io/cloudsql-docker/gce-proxy:1.17',
    command: [
      '/cloud_sql_proxy',
      pulumi.interpolate`-instances=${connectionName}=tcp:${databasePort}`,
      '-credential_file=/secrets/cloudsql/credentials.json',
    ],
    ports: [
      {
        containerPort: databasePort,
        name: 'sql-int',
      },
    ],
    volumeMounts: addGoogleCredentials
      ? [
          {
            name: 'google-credentials',
            mountPath: '/secrets/cloudsql',
            readOnly: true,
          },
        ]
      : [],
  };
}
