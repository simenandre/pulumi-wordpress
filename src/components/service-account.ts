import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';

export interface ServiceAccountArgs {
  /**
   * The account id that is used to generate the service
   * account email address and a stable unique id. It is unique within a project,
   * must be 6-30 characters long, and match the regular expression `a-z`
   * to comply with RFC1035. Changing this forces a new service account to be created.
   */
  accountId: pulumi.Input<string>;
  /**
   * The role that should be applied. Note that custom roles must be of the format
   * `[projects|organizations]/{parent-name}/roles/{role-name}`.
   */
  roles: pulumi.Input<string[]>;
}

export class ServiceAccount extends pulumi.ComponentResource {
  readonly account: gcp.serviceaccount.Account;
  readonly members: pulumi.Output<gcp.projects.IAMMember[]>;
  readonly key: gcp.serviceaccount.Key;

  constructor(
    name: string,
    args: ServiceAccountArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('wordpress:service-account', name, args, opts);

    const { accountId, roles } = args;

    this.account = new gcp.serviceaccount.Account(
      `${name}-service`,
      {
        accountId,
      },
      { parent: this },
    );

    this.key = new gcp.serviceaccount.Key(
      `${name}-key`,
      {
        serviceAccountId: this.account.accountId,
      },
      { parent: this },
    );

    this.members = pulumi.output(roles).apply(roles =>
      roles.map(
        role =>
          new gcp.projects.IAMMember(
            `${name}-service`,
            {
              role,
              member: this.account.email.apply(a => `serviceAccount:${a}`),
            },
            { parent: this },
          ),
      ),
    );
  }
}
