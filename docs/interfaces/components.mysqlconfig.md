[pulumi-wordpress](../README.md) / [Exports](../modules.md) / [components](../modules/components.md) / MySQLConfig

# Interface: MySQLConfig

## Hierarchy

* **MySQLConfig**

## Index

### Properties

* [availabilityType](components.mysqlconfig.md#availabilitytype)
* [databaseVersion](components.mysqlconfig.md#databaseversion)
* [diskAutoresize](components.mysqlconfig.md#diskautoresize)
* [diskSize](components.mysqlconfig.md#disksize)
* [enableBackups](components.mysqlconfig.md#enablebackups)
* [tier](components.mysqlconfig.md#tier)

## Properties

### availabilityType

• `Optional` **availabilityType**: *Input*<*string*\>

The availability type of the Cloud SQL
instance, high availability (`REGIONAL`) or single zone (`ZONAL`).' For MySQL
instances, ensure that `settings.backup_configuration.enabled` and
`settings.backup_configuration.binary_log_enabled` are both set to `true`.

Defined in: [src/components/sql.ts:36](https://github.com/cobraz/pulumi-wordpress/blob/5b7aa29/src/components/sql.ts#L36)

___

### databaseVersion

• `Optional` `Readonly` **databaseVersion**: *Input*<*string*\>

The MySQL, PostgreSQL or
SQL Server (beta) version to use. Supported values include `MYSQL_5_6`,
`MYSQL_5_7`, `POSTGRES_9_6`,`POSTGRES_10`, `POSTGRES_11`, `POSTGRES_12`, `SQLSERVER_2017_STANDARD`,
`SQLSERVER_2017_ENTERPRISE`, `SQLSERVER_2017_EXPRESS`, `SQLSERVER_2017_WEB`.
[Database Version Policies](https://cloud.google.com/sql/docs/sqlserver/db-versions)
includes an up-to-date reference of supported versions.

Defined in: [src/components/sql.ts:13](https://github.com/cobraz/pulumi-wordpress/blob/5b7aa29/src/components/sql.ts#L13)

___

### diskAutoresize

• `Optional` **diskAutoresize**: *Input*<*boolean*\>

Configuration to increase storage size automatically.  Note that future `pulumi apply` calls will attempt to resize the disk to the value specified in `diskSize` - if this is set, do not set `diskSize`.

Defined in: [src/components/sql.ts:18](https://github.com/cobraz/pulumi-wordpress/blob/5b7aa29/src/components/sql.ts#L18)

___

### diskSize

• `Optional` **diskSize**: *Input*<*number*\>

The size of data disk, in GB. Size of a running instance cannot be reduced but can be increased.

Defined in: [src/components/sql.ts:23](https://github.com/cobraz/pulumi-wordpress/blob/5b7aa29/src/components/sql.ts#L23)

___

### enableBackups

• `Optional` **enableBackups**: *Input*<*boolean*\>

Enable automatic backups

Defined in: [src/components/sql.ts:28](https://github.com/cobraz/pulumi-wordpress/blob/5b7aa29/src/components/sql.ts#L28)

___

### tier

• `Optional` **tier**: *Input*<*string*\>

The machine type to use. See [tiers](https://cloud.google.com/sql/docs/admin-api/v1beta4/tiers)
for more details and supported versions. Postgres supports only shared-core machine types such as `db-f1-micro`,
and custom machine types such as `db-custom-2-13312`. See the [Custom Machine Type Documentation](https://cloud.google.com/compute/docs/instances/creating-instance-with-custom-machine-type#create) to learn about specifying custom machine types.

Defined in: [src/components/sql.ts:43](https://github.com/cobraz/pulumi-wordpress/blob/5b7aa29/src/components/sql.ts#L43)
