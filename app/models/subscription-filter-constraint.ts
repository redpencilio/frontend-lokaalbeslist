import Model, { attr } from '@ember-data/model';
import { ConstraintPredicate, ConstraintSubject } from 'frontend-lokaalbeslist/utils/constraints';

export default class SubscriptionFilterConstraint extends Model {
  @attr('string') declare subject: ConstraintSubject;

  @attr('string') declare predicate: ConstraintPredicate;

  @attr('string') declare object: string | undefined;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'subscription-filter-constraint': SubscriptionFilterConstraint;
  }
}
