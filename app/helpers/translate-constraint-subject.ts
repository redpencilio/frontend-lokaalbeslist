import { helper } from '@ember/component/helper';
import { ConstraintSubject } from 'frontend-lokaalbeslist/utils/constraints';

export default helper((params) => {
  const subject: ConstraintSubject = params[0];
  switch (subject) {
    case 'description': return "Beschrijving"
    case 'title': return "Titel"
    case 'governanceArea': return "Gemeente"
    case 'sessionDate': return "Zittingsdatum"
    case 'sessionLocation': return "Locatie van zitting"
  }
});
