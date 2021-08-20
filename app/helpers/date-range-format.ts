import { helper } from '@ember/component/helper';

export default helper((params) => {
  const [startDateTimeString, endDateTimeString] = params;
  const startDate = new Date(startDateTimeString);

  console.log(startDateTimeString, endDateTimeString);

  const startString = startDate.toLocaleTimeString('nl-be', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
  });

  if (!endDateTimeString) {
    return startString;
  }

  const endDate = new Date(endDateTimeString);

  if (startDate.toDateString() == endDate.toDateString()) {
    // 01 jan 1970 00:00 - 01:00
    const endString = endDate.toLocaleTimeString('nl-be', {
      hour: 'numeric',
      minute: '2-digit',
    })

    return `${startString} - ${endString}`;
  } else {
    // 01 jan 1970 00:00 - 02 jan 1970 01:00

    const endString = endDate.toLocaleTimeString('nl-be', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })

    return `${startString} - ${endString}`;
  }
});
