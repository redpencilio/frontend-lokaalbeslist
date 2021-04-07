import Route from '@ember/routing/route';

import muSearch from '../utils/mu-search';

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
