import { helper } from '@ember/component/helper';

export default helper(<T>([set, element]: [Set<T>, T]) => set.has(element));
