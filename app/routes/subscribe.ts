import Route from '@ember/routing/route';

export default class SubscribeRoute extends Route {
  model() {
    return this.store.createRecord('subscription-filter');
  }
}
