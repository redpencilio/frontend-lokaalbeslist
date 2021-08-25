import { helper } from '@ember/component/helper';

export default helper((params) => {
  const [list] = params;
  return list.length;
});
