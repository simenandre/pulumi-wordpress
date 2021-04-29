import * as pulumi from '@pulumi/pulumi';

export interface IamMember {
  member: pulumi.Input<string>;
  role: pulumi.Input<string>;
}
