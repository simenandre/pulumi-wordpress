[pulumi-wordpress](../README.md) / [Exports](../modules.md) / [index](../modules/index.md) / CloudRunWordpress

# Class: CloudRunWordpress

## Hierarchy

* *ComponentResource*

  ↳ **CloudRunWordpress**

## Index

### Constructors

* [constructor](index.cloudrunwordpress.md#constructor)

### Properties

* [cloudRunIamMember](index.cloudrunwordpress.md#cloudruniammember)
* [database](index.cloudrunwordpress.md#database)
* [service](index.cloudrunwordpress.md#service)
* [serviceAccount](index.cloudrunwordpress.md#serviceaccount)
* [storageBucket](index.cloudrunwordpress.md#storagebucket)
* [storageBucketIamMember](index.cloudrunwordpress.md#storagebucketiammember)
* [urn](index.cloudrunwordpress.md#urn)

### Methods

* [getData](index.cloudrunwordpress.md#getdata)
* [getProvider](index.cloudrunwordpress.md#getprovider)
* [initialize](index.cloudrunwordpress.md#initialize)
* [registerOutputs](index.cloudrunwordpress.md#registeroutputs)
* [isInstance](index.cloudrunwordpress.md#isinstance)

## Constructors

### constructor

\+ **new CloudRunWordpress**(`name`: *string*, `args`: [*CloudRunWordpressConfig*](../interfaces/components_cloud_run_wordpress.cloudrunwordpressconfig.md), `opts?`: ComponentResourceOptions): [*CloudRunWordpress*](components_cloud_run_wordpress.cloudrunwordpress.md)

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`name` | *string* | - |
`args` | [*CloudRunWordpressConfig*](../interfaces/components_cloud_run_wordpress.cloudrunwordpressconfig.md) | - |
`opts` | ComponentResourceOptions | ... |

**Returns:** [*CloudRunWordpress*](components_cloud_run_wordpress.cloudrunwordpress.md)

Defined in: [src/components/cloud-run-wordpress.ts:53](https://github.com/cobraz/pulumi-wordpress/blob/5b7aa29/src/components/cloud-run-wordpress.ts#L53)

## Properties

### cloudRunIamMember

• `Readonly` **cloudRunIamMember**: *IamMember*

Defined in: [src/components/cloud-run-wordpress.ts:50](https://github.com/cobraz/pulumi-wordpress/blob/5b7aa29/src/components/cloud-run-wordpress.ts#L50)

___

### database

• `Readonly` **database**: [*MySQLComponent*](components_sql.mysqlcomponent.md)

Defined in: [src/components/cloud-run-wordpress.ts:49](https://github.com/cobraz/pulumi-wordpress/blob/5b7aa29/src/components/cloud-run-wordpress.ts#L49)

___

### service

• `Readonly` **service**: *Service*

Defined in: [src/components/cloud-run-wordpress.ts:48](https://github.com/cobraz/pulumi-wordpress/blob/5b7aa29/src/components/cloud-run-wordpress.ts#L48)

___

### serviceAccount

• `Readonly` **serviceAccount**: [*ServiceAccount*](components_service_account.serviceaccount.md)

Defined in: [src/components/cloud-run-wordpress.ts:53](https://github.com/cobraz/pulumi-wordpress/blob/5b7aa29/src/components/cloud-run-wordpress.ts#L53)

___

### storageBucket

• `Readonly` **storageBucket**: *Bucket*

Defined in: [src/components/cloud-run-wordpress.ts:51](https://github.com/cobraz/pulumi-wordpress/blob/5b7aa29/src/components/cloud-run-wordpress.ts#L51)

___

### storageBucketIamMember

• `Readonly` **storageBucketIamMember**: *BucketIAMMember*[]

Defined in: [src/components/cloud-run-wordpress.ts:52](https://github.com/cobraz/pulumi-wordpress/blob/5b7aa29/src/components/cloud-run-wordpress.ts#L52)

___

### urn

• `Readonly` **urn**: *Output*<*string*\>

urn is the stable logical URN used to distinctly address a resource, both before and after
deployments.

Defined in: node_modules/@pulumi/pulumi/resource.d.ts:17

## Methods

### getData

▸ `Protected`**getData**(): *Promise*<*any*\>

Retrieves the data produces by [initialize].  The data is immediately available in a
derived class's constructor after the `super(...)` call to `ComponentResource`.

**Returns:** *Promise*<*any*\>

Defined in: node_modules/@pulumi/pulumi/resource.d.ts:347

___

### getProvider

▸ **getProvider**(`moduleMember`: *string*): *ProviderResource*

#### Parameters:

Name | Type |
------ | ------ |
`moduleMember` | *string* |

**Returns:** *ProviderResource*

Defined in: node_modules/@pulumi/pulumi/resource.d.ts:19

___

### initialize

▸ `Protected`**initialize**(`args`: *Record*<*string*, *any*\>): *Promise*<*any*\>

Can be overridden by a subclass to asynchronously initialize data for this Component
automatically when constructed.  The data will be available immediately for subclass
constructors to use.  To access the data use `.getData`.

#### Parameters:

Name | Type |
------ | ------ |
`args` | *Record*<*string*, *any*\> |

**Returns:** *Promise*<*any*\>

Defined in: node_modules/@pulumi/pulumi/resource.d.ts:342

___

### registerOutputs

▸ `Protected`**registerOutputs**(`outputs?`: *Record*<*string*, *any*\> \| *Promise*<*Record*<*string*, *any*\>\> \| *Output*<*Record*<*string*, *any*\>\>): *void*

registerOutputs registers synthetic outputs that a component has initialized, usually by
allocating other child sub-resources and propagating their resulting property values.

ComponentResources can call this at the end of their constructor to indicate that they are
done creating child resources.  This is not strictly necessary as this will automatically be
called after the `initialize` method completes.

#### Parameters:

Name | Type |
------ | ------ |
`outputs?` | *Record*<*string*, *any*\> \| *Promise*<*Record*<*string*, *any*\>\> \| *Output*<*Record*<*string*, *any*\>\> |

**Returns:** *void*

Defined in: node_modules/@pulumi/pulumi/resource.d.ts:356

___

### isInstance

▸ `Static`**isInstance**(`obj`: *any*): obj is ComponentResource<any\>

Returns true if the given object is an instance of CustomResource.  This is designed to work even when
multiple copies of the Pulumi SDK have been loaded into the same process.

#### Parameters:

Name | Type |
------ | ------ |
`obj` | *any* |

**Returns:** obj is ComponentResource<any\>

Defined in: node_modules/@pulumi/pulumi/resource.d.ts:322
