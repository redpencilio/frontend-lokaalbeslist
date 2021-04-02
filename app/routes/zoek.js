import Route from '@ember/routing/route';

import muSearch from '../utils/mu-search';

export default class ZoekRoute extends Route {
  async model() {
    // TODO
    const query = {};
    query[':sqs:'] = '*';

    return await muSearch(
      '/search/agendapunten',
      0,
      30,
      undefined,
      query,
      function (item) {
        item.attributes.id = item.id;
        return item.attributes;
      }
    );
  }
}
