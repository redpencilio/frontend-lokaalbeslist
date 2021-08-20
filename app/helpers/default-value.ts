import { helper } from '@ember/component/helper';

export default helper((params) => {
  const [maybeValue, defaultValue] = params;

  return maybeValue ||  defaultValue;
});
