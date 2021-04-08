import { helper } from '@ember/component/helper';

export default helper((params) => {
  const [number, singular, plural] = params;
  return number === 1 ? singular : plural;
});
