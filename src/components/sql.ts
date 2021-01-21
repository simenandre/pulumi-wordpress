import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
import { escapeName } from '../libs/utils';

export interface MySQLConfig {
  /**
   * The MySQL, PostgreSQL or
   * SQL Server (beta) version to use. Supported values include `MYSQL_5_6`,
   * `MYSQL_5_7`, `POSTGRES_9_6`,`POSTGRES_10`, `POSTGRES_11`, `POSTGRES_12`, `SQLSERVER_2017_STANDARD`,
   * `SQLSERVER_2017_ENTERPRISE`, `SQLSERVER_2017_EXPRESS`, `SQLSERVER_2017_WEB`.
   * [Database Version Policies](https://cloud.google.com/sql/docs/sqlserver/db-versions)
   * includes an up-to-date reference of supported versions.
   */
  readonly databaseVersion?: pulumi.Input<string>;

  /**
   * Configuration to increase storage size automatically.  Note that future `pulumi apply` calls will attempt to resize the disk to the value specified in `diskSize` - if this is set, do not set `diskSize`.
   */
  readonly diskAutoresize?: pulumi.Input<boolean>;

  /**
   * The size of data disk, in GB. Size of a running instance cannot be reduced but can be increased.
   */
  readonly diskSize?: pulumi.Input<number>;

  /**
   * Enable automatic backups
   */
  readonly enableBackups?: pulumi.Input<boolean>;

  /**
   * The availability type of the Cloud SQL
   * instance, high availability (`REGIONAL`) or single zone (`ZONAL`).' For MySQL
   * instances, ensure that `settings.backup_configuration.enabled` and
   * `settings.backup_configuration.binary_log_enabled` are both set to `true`.
   */
  readonly availabilityType?: pulumi.Input<string>;

  /**
   * The machine type to use. See [tiers](https://cloud.google.com/sql/docs/admin-api/v1beta4/tiers)
   * for more details and supported versions. Postgres supports only shared-core machine types such as `db-f1-micro`,
   * and custom machine types such as `db-custom-2-13312`. See the [Custom Machine Type Documentation](https://cloud.google.com/compute/docs/instances/creating-instance-with-custom-machine-type#create) to learn about specifying custom machine types.
   */
  readonly tier?: pulumi.Input<string>;
}

export interface DatabaseSettings {
  connectionName: pulumi.Input<string>;
  databaseName: pulumi.Input<string>;
  databaseUsername: pulumi.Input<string>;
  databasePassword: pulumi.Input<string>;
}

export class MySQLComponent extends pulumi.ComponentResource {
  readonly instance: gcp.sql.DatabaseInstance;
  readonly database: gcp.sql.Database;
  readonly user: gcp.sql.User;

  constructor(
    name: string,
    args: MySQLConfig,
    opts: pulumi.ComponentResourceOptions = {},
  ) {
    super('wordpress:mysql', name, {}, opts);

    this.instance = new gcp.sql.DatabaseInstance(
      name,
      {
        name: escapeName(name),
        databaseVersion: args.databaseVersion,
        deletionProtection: false,
        settings: {
          availabilityType: args.availabilityType,
          backupConfiguration: {
            enabled: args.enableBackups || false,
          },
          diskAutoresize: true,
          diskSize: args.diskSize,
          diskType: 'PD_SSD',
          tier: args.tier || 'db-f1-micro',
        },
      },
      { parent: this },
    );

    this.database = new gcp.sql.Database(
      name,
      {
        name: escapeName(name, 5, 16),
        instance: this.instance.name,
      },
      { parent: this },
    );

    this.user = new gcp.sql.User(
      name,
      {
        instance: this.instance.name,
        name: escapeName(name, 5, 16),
      },
      { parent: this },
    );
  }
}
