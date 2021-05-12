import { helper } from '@ember/component/helper';

// Sad
// See also this issue https://github.com/emberjs/ember.js/issues/9630
export default helper(
  ([object, key]: [{ [key: string]: any }, string]) => object[key]
);
