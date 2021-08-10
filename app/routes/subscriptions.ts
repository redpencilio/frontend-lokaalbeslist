import ArrayProxy from '@ember/array/proxy';
import Transition from '@ember/routing/-private/transition';
import Route from '@ember/routing/route';

interface SubscriptionsModel {}

interface SubscriptionsParams {
  token: string | null;
}

export default class SubscriptionsRoute extends Route<SubscriptionsModel> {
  async model(
      params: SubscriptionsParams,
      _transition: Transition
  ): Promise<ArrayProxy<SubscriptionsModel> | void> {
    if (params.token === null) {
      this.transitionTo('subscribe');
    }

    const model = await this.store.query('subscription-filter', {
      'token': params.token
    }).catch((err) => {
        console.error(err);
        this.transitionTo('subscribe');
    });

    return model;
  }
}
