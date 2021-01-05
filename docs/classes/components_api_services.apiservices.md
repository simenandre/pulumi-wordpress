[pulumi-wordpress](../README.md) / [Exports](../modules.md) / [components/api-services](../modules/components_api_services.md) / ApiServices

# Class: ApiServices

## Hierarchy

* *ComponentResource*

  ↳ **ApiServices**

## Index

### Constructors

* [constructor](components_api_services.apiservices.md#constructor)

### Properties

* [api\_services](components_api_services.apiservices.md#api_services)
* [services](components_api_services.apiservices.md#services)
* [urn](components_api_services.apiservices.md#urn)

### Methods

* [getData](components_api_services.apiservices.md#getdata)
* [getProvider](components_api_services.apiservices.md#getprovider)
* [initialize](components_api_services.apiservices.md#initialize)
* [registerOutputs](components_api_services.apiservices.md#registeroutputs)
* [isInstance](components_api_services.apiservices.md#isinstance)

## Constructors

### constructor

\+ **new ApiServices**(`name`: *string*, `args`: [*ApiServicesConfig*](../interfaces/components_api_services.apiservicesconfig.md), `opts?`: ComponentResourceOptions): [*ApiServices*](components_api_services.apiservices.md)

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`name` | *string* | - |
`args` | [*ApiServicesConfig*](../interfaces/components_api_services.apiservicesconfig.md) | - |
`opts` | ComponentResourceOptions | ... |

**Returns:** [*ApiServices*](components_api_services.apiservices.md)

Defined in: [src/components/api-services.ts:25](https://github.com/cobraz/pulumi-wordpress/blob/5b7aa29/src/components/api-services.ts#L25)

## Properties

### api\_services

• `Private` **api\_services**: *string*[]

Defined in: [src/components/api-services.ts:20](https://github.com/cobraz/pulumi-wordpress/blob/5b7aa29/src/components/api-services.ts#L20)

___

### services

• `Readonly` **services**: *Service*[]

Defined in: [src/components/api-services.ts:18](https://github.com/cobraz/pulumi-wordpress/blob/5b7aa29/src/components/api-services.ts#L18)

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
