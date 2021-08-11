import Route from '@ember/routing/route';

interface SubscribeRouteParams {
  search?: string;
  governanceAreas?: string[];
}

export default class SubscribeRoute extends Route {
  queryParams = {
    'search': {
      refreshModel: true
    },
    'governanceAreas': {
      refreshModel: true
    }
  };

  model(params: SubscribeRouteParams) {
    let filter = this.store.createRecord('subscription-filter', {
      requireAll: false,
    });

    params.governanceAreas?.forEach((governanceArea) => {
      filter.constraints.addObject(
        this.store.createRecord('subscription-filter-constraint', {
          subject: 'governanceArea',
          predicate: 'governanceAreaEquals',
          object: governanceArea
        })
      );
    });

    if (params.search) {
      filter.constraints.addObject(
        this.store.createRecord('subscription-filter-constraint', {
          subject: 'title',
          predicate: 'textContains',
          object: params.search
        })
      );
    }
    return filter;
  }
}
