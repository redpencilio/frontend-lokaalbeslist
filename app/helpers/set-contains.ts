import { helper } from '@ember/component/helper';

export default helper(<T>(params: [Set<T>, T]) => {
  const [set, element] = params;
  return set.has(element);
});
