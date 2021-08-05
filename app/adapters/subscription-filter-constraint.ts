import SubscriptionAdapter from "frontend-lokaalbeslist/adapters/subscription";

export default class SubscriptionFilterConstraint extends SubscriptionAdapter {}

declare module 'ember-data/types/registries/adapter' {
  export default interface AdapterRegistry {
    'subscription-filter': SubscriptionFilterConstraint;
  }
}
