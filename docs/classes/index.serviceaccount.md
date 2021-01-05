[pulumi-wordpress](../README.md) / [Exports](../modules.md) / [index](../modules/index.md) / ServiceAccount

# Class: ServiceAccount

## Hierarchy

* *ComponentResource*

  ↳ **ServiceAccount**

## Index

### Constructors

* [constructor](index.serviceaccount.md#constructor)

### Properties

* [account](index.serviceaccount.md#account)
* [key](index.serviceaccount.md#key)
* [members](index.serviceaccount.md#members)
* [urn](index.serviceaccount.md#urn)

### Methods

* [getData](index.serviceaccount.md#getdata)
* [getProvider](index.serviceaccount.md#getprovider)
* [initialize](index.serviceaccount.md#initialize)
* [registerOutputs](index.serviceaccount.md#registeroutputs)
* [isInstance](index.serviceaccount.md#isinstance)

## Constructors

### constructor

\+ **new ServiceAccount**(`name`: *string*, `args`: [*ServiceAccountArgs*](../interfaces/components_service_account.serviceaccountargs.md), `opts?`: ComponentResourceOptions): [*ServiceAccount*](components_service_account.serviceaccount.md)

#### Parameters:

Name | Type |
------ | ------ |
`name` | *string* |
`args` | [*ServiceAccountArgs*](../interfaces/components_service_account.serviceaccountargs.md) |
`opts?` | ComponentResourceOptions |

**Returns:** [*ServiceAccount*](components_service_account.serviceaccount.md)

Defined in: [src/components/service-account.ts:22](https://github.com/cobraz/pulumi-wordpress/blob/5b7aa29/src/components/service-account.ts#L22)

## Properties

### account

• `Readonly` **account**: *Account*

Defined in: [src/components/service-account.ts:20](https://github.com/cobraz/pulumi-wordpress/blob/5b7aa29/src/components/service-account.ts#L20)

___

### key

• `Readonly` **key**: *Key*

Defined in: [src/components/service-account.ts:22](https://github.com/cobraz/pulumi-wordpress/blob/5b7aa29/src/components/service-account.ts#L22)

___

### members

• `Readonly` **members**: *Output*<*IAMMember*[]\>

Defined in: [src/components/service-account.ts:21](https://github.com/cobraz/pulumi-wordpress/blob/5b7aa29/src/components/service-account.ts#L21)

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
