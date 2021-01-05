[pulumi-wordpress](../README.md) / [Exports](../modules.md) / [components](../modules/components.md) / ServiceAccountArgs

# Interface: ServiceAccountArgs

## Hierarchy

* **ServiceAccountArgs**

## Index

### Properties

* [accountId](components.serviceaccountargs.md#accountid)
* [roles](components.serviceaccountargs.md#roles)

## Properties

### accountId

• **accountId**: *Input*<*string*\>

The account id that is used to generate the service
account email address and a stable unique id. It is unique within a project,
must be 6-30 characters long, and match the regular expression `a-z`
to comply with RFC1035. Changing this forces a new service account to be created.

Defined in: [src/components/service-account.ts:11](https://github.com/cobraz/pulumi-wordpress/blob/5b7aa29/src/components/service-account.ts#L11)

___

### roles

• **roles**: *Input*<*string*[]\>

The role that should be applied. Note that custom roles must be of the format
`[projects|organizations]/{parent-name}/roles/{role-name}`.

Defined in: [src/components/service-account.ts:16](https://github.com/cobraz/pulumi-wordpress/blob/5b7aa29/src/components/service-account.ts#L16)
