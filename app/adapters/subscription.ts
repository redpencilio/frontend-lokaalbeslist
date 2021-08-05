import DS from 'ember-data';

export default class SubscriptionAdapter extends DS.JSONAPIAdapter {
  // Prepend /subscription/ to he URL for lokaalbeslist-subscription-service specific requests
  namespace = 'subscription';
}
