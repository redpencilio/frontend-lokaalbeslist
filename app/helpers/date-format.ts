import { helper } from '@ember/component/helper';

export default helper((params) => {
  const [dateTimeString] = params;
  let date = new Date(dateTimeString);
  return date.toLocaleTimeString('nl-be', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
});
