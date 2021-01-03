import * as gcp from '@pulumi/gcp';
import * as pw from 'pulumi-wordpress';

const provider = new gcp.Provider('gcp', {
  project: 'test-pulumi-wordpress',
  zone: 'europe-west3-a',
});

export const build = new pw.GCRDocker('test', {
  build: '.'
}, { provider });

new pw.CloudRunWordpress(
  'test',
  {
    image: build.image.imageName,
    location: 'europe-west3',
  },
  { provider },
);