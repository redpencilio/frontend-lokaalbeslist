import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import SubscriptionFilterConstraint from 'frontend-lokaalbeslist/models/subscription-filter-constraint';
import DS from 'ember-data';

export default class SubscriptionFilter extends Model {
  @attr('boolean') declare requireAll: boolean;
  @attr('string') declare email: string;
  
  @belongsTo('subscription-filter', { inverse: 'subFilters' }) declare parentFilter:
    DS.PromiseObject<SubscriptionFilter>;
  @hasMany('subscription-filter', { inverse: 'parentFilter' }) declare subFilters:
    DS.PromiseManyArray<SubscriptionFilter>;
  @hasMany('subscription-filter-constraint') declare constraints:
    DS.PromiseManyArray<SubscriptionFilterConstraint>;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'subscription-filter': SubscriptionFilter;
  }
}
