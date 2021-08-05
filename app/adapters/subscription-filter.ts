import SubscriptionAdapter from "frontend-lokaalbeslist/adapters/subscription";

export default class SubscriptionFilter extends SubscriptionAdapter {}

declare module 'ember-data/types/registries/adapter' {
  export default interface AdapterRegistry {
    'subscription-filter': SubscriptionFilter;
  }
}
