import * as gcp from '@pulumi/gcp';
import * as pw from 'pulumi-wordpress';

const provider = new gcp.Provider('gcp', {
  project: 'test-pulumi-wordpress',
  zone: 'europe-west3-a',
});

new pw.Wordpress(
  'test',
  {
    build: '.',
    location: 'europe-west3',
    domain: 'winning.cobraz.no',
  },
  { provider },
);
