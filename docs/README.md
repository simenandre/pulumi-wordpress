pulumi-wordpress / [Exports](modules.md)

![Pulumi Wordpress](./.github/assets/pulumi-wordpress.svg)

This Pulumi package makes it easy to deploy WordPress to Google Cloud Platform.

## Quickstart

```shell
▶ yarn add pulumi-wordpress
```

## Documentation

Apart from this README, you can find details and examples of using the SDK in
the following places:

- [API Documentation][docs]
- [Pulumi][pulumi]

## Example

```typescript
import * as gcp from '@pulumi/gcp';
import * as pw from 'pulumi-wordpress';

// This component utilizes @pulumi/docker to build your a local docker file.
// You can see an example of that Docker in tests/simple-project
export const build = new pw.GCRDocker('test', {
  build: '.'
}, { provider });

// This components includes a MySQL (Cloud SQL), Cloud Run with the defined
// image and a Storage Bucket.
new pw.CloudRunWordpress(
  'test',
  {
    image: build.image.imageName,
    location: 'europe-west3',
  },
  { provider },
);
```

## Motivation

WordPress has benefits for small and midsized website projects, however
maintaining them in numbers quickly become cumbersome. Running WordPress in a
cloud environment requires experience with cloud architecture, and consequently
DevOps manpower.

The goal is to provide a package/template which installs, updates and
orchestrates one WordPress installation running on Google Cloud. It should
automatically update on every minor version, and should be easily configured
with a standardized configuration file.

[docs]: ./docs
[pulumi]: https://pulumi.com/
