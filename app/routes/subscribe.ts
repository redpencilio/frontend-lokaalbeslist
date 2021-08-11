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
      requireAll: true,
    });

    if (params.governanceAreas) {
      let governanceAreaFilter = this.store.createRecord(
        'subscription-filter',
        {
          requireAll: false,
        }
      );
      params.governanceAreas?.forEach((governanceArea) => {
        governanceAreaFilter.constraints.addObject(
          this.store.createRecord('subscription-filter-constraint', {
            subject: 'governanceArea',
            predicate: 'governanceAreaEquals',
            object: governanceArea
          })
        );
      });

      filter.subFilters.addObject(governanceAreaFilter);
    }

    if (params.search) {
      let searchFilter = this.store.createRecord('subscription-filter', {
        requireAll: false,
      });
      searchFilter.constraints.addObject(
        this.store.createRecord('subscription-filter-constraint', {
          subject: 'title',
          predicate: 'textContains',
          object: params.search
        })
      );
      searchFilter.constraints.addObject(
        this.store.createRecord('subscription-filter-constraint', {
          subject: 'description',
          predicate: 'textContains',
          object: params.search
        })
      );
      filter.subFilters.addObject(searchFilter);
    }
    return filter;
  }
}
