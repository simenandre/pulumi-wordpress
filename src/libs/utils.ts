import * as random from '@pulumi/random';
import { interpolate, Output, output } from '@pulumi/pulumi';

export function invariant(condition: any, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export function escapeName(name: string, minLen = 8, maxLen = 28): Output<string> {
  name = name.replace(/[^\w\*]/g, '').toLowerCase();
  if (name.length < minLen) {
    const missingLen = name.length - minLen - 1;
    invariant(missingLen > 0, 'Expect length to be higher than zero');
    const rand = new random.RandomString(name, {
      length: missingLen,
      special: false,
      upper: false,
    });
    return interpolate`${name}-${rand.result}`;
  }
  return output(name.substring(0, maxLen));
}
