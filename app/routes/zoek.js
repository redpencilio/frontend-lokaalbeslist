import Route from '@ember/routing/route';

import muSearch from '../utils/mu-search';
import Snapshot from '../utils/snapshot';

const PARAM_FIELDS = ['page', 'size', 'sort'];

export default class ZoekRoute extends Route {
  // https://guides.emberjs.com/release/routing/query-params/
  queryParams = {};

  constructor() {
    super(...arguments);

    // Trigger model refresh when query parameters change, all query parameters
    // will be an argument to `this.model`.
    PARAM_FIELDS.forEach((field) => {
      this.queryParams[field] = { refreshModel: true };
    });

    // We will keep a snapshot of all search parameters (page, size, sort, filters)
    // so we can reset the page if any of it changes.
    this.lastParams = new Snapshot();
  }

  beforeModel(transition) {
    // Reset the page number if any of the query parameters has changed.
    let params = transition.to.queryParams;
    this.lastParams.stageLive(params);
    if (
      this.lastParams.hasBase &&
      this.lastParams.anyFieldChanged(Object.keys(params), ['page'])
    ) {
      this.transitionTo({ queryParams: { page: undefined } });
    }
    this.lastParams.commit();
  }

  async model(params) {
    // TODO
    const query = {};
    query[':sqs:'] = '*';

    return await muSearch(
      '/search/agendapunten',
      params.page || 0,
      params.size || 20,
      params.sort,
      query,
      function (item) {
        item.attributes.id = item.id;
        return item.attributes;
      }
    );
  }
}
