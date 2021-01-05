[pulumi-wordpress](../README.md) / [Exports](../modules.md) / [components](../modules/components.md) / CloudRunWordpressConfig

# Interface: CloudRunWordpressConfig

## Hierarchy

* **CloudRunWordpressConfig**

## Index

### Properties

* [databaseDiskSize](components.cloudrunwordpressconfig.md#databasedisksize)
* [envs](components.cloudrunwordpressconfig.md#envs)
* [image](components.cloudrunwordpressconfig.md#image)
* [location](components.cloudrunwordpressconfig.md#location)
* [wordpressDebug](components.cloudrunwordpressconfig.md#wordpressdebug)
* [wpHome](components.cloudrunwordpressconfig.md#wphome)
* [wpSiteUrl](components.cloudrunwordpressconfig.md#wpsiteurl)

## Properties

### databaseDiskSize

• `Optional` `Readonly` **databaseDiskSize**: *Input*<*number*\>

Storage in GB for database.

**`default`** 10

Defined in: [src/components/cloud-run-wordpress.ts:22](https://github.com/cobraz/pulumi-wordpress/blob/5b7aa29/src/components/cloud-run-wordpress.ts#L22)

___

### envs

• `Optional` `Readonly` **envs**: *Input*<ServiceTemplateSpecContainerEnv\>[]

Extra environment variables

Defined in: [src/components/cloud-run-wordpress.ts:44](https://github.com/cobraz/pulumi-wordpress/blob/5b7aa29/src/components/cloud-run-wordpress.ts#L44)

___

### image

• `Readonly` **image**: *Input*<*string*\>

Wordpress image

Defined in: [src/components/cloud-run-wordpress.ts:11](https://github.com/cobraz/pulumi-wordpress/blob/5b7aa29/src/components/cloud-run-wordpress.ts#L11)

___

### location

• `Readonly` **location**: *Input*<*string*\>

The location of the cloud run instance. eg us-central1

Defined in: [src/components/cloud-run-wordpress.ts:16](https://github.com/cobraz/pulumi-wordpress/blob/5b7aa29/src/components/cloud-run-wordpress.ts#L16)

___

### wordpressDebug

• `Optional` `Readonly` **wordpressDebug**: *Input*<*boolean*\>

Turn on Wordpress Debug

Defined in: [src/components/cloud-run-wordpress.ts:27](https://github.com/cobraz/pulumi-wordpress/blob/5b7aa29/src/components/cloud-run-wordpress.ts#L27)

___

### wpHome

• `Optional` `Readonly` **wpHome**: *Input*<*string*\>

For Bedrock
Domain environment

Defined in: [src/components/cloud-run-wordpress.ts:33](https://github.com/cobraz/pulumi-wordpress/blob/5b7aa29/src/components/cloud-run-wordpress.ts#L33)

___

### wpSiteUrl

• `Optional` `Readonly` **wpSiteUrl**: *Input*<*string*\>

For Bedrock
Domain environment

Defined in: [src/components/cloud-run-wordpress.ts:39](https://github.com/cobraz/pulumi-wordpress/blob/5b7aa29/src/components/cloud-run-wordpress.ts#L39)
