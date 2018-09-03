import { helper as buildHelper } from '@ember/component/helper';

export function limitCharacters(params/*, hash*/) {
  if (params[0].length > 70) {
    return params[0].slice(0, 70) + '...';
  }
  return params[0];
}

export default buildHelper(limitCharacters);
