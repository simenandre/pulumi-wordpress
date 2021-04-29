import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import { IamMember } from '../types';

export interface StorageArgs {
  /**
   * The [GCS location](https://cloud.google.com/storage/docs/bucket-locations)
   */
  location: string;

  /**
   * iamMember
   */
  iamMembers?: pulumi.Input<IamMember[]>;

  /**
   * Additional Bucket Configuration
   */
  bucketConfig?: Partial<gcp.storage.BucketArgs>;
}

export class Storage extends pulumi.ComponentResource {
  readonly storageBucket: gcp.storage.Bucket;
  readonly iamMembers: pulumi.Output<gcp.storage.BucketIAMMember[]>;

  constructor(
    name: string,
    {
      location,
      iamMembers = pulumi.output([]),
      bucketConfig = {},
    }: StorageArgs,
    opts: pulumi.ComponentResourceOptions = {},
  ) {
    super('wordpress:storage', name, {}, opts);
    this.storageBucket = new gcp.storage.Bucket(
      name,
      {
        location,
        cors: [
          {
            methods: ['*'],
            origins: ['*'],
          },
        ],
        ...bucketConfig,
      },
      { parent: this, protect: true },
    );

    this.iamMembers = pulumi.output(iamMembers).apply(members =>
      members.map(({ member, role }) => {
        const [prefix, email] = member.split(':');
        const name = email || prefix;
        return new gcp.storage.BucketIAMMember(
          name,
          {
            bucket: this.storageBucket.name,
            member,
            role,
          },
          { parent: this },
        );
      }),
    );
  }
}
