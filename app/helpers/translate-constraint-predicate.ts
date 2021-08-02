import { helper } from '@ember/component/helper';
import { ConstraintPredicate } from 'frontend-lokaalbeslist/utils/constraints';

export default helper((params) => {
  const subject: ConstraintPredicate = params[0];
  switch (subject) {
    case 'textEquals': return "is"
    case 'textContains': return "bevat"
    case 'dateEquals': return "is op"
    case 'dateIsBefore': return "is voor"
    case 'dateIsAfter': return "is na"
    case 'exists': return "is bekend"
    case 'notExists': return "is niet bekend"
    default: return "ONBEKENDE VOORWAARDE"
  }
});
