import Route from '@ember/routing/route';
import ArrayProxy from '@ember/array/proxy';

import { SearchResult } from 'frontend-poc-participatie/utils/search-result';
import muSearch from 'frontend-poc-participatie/utils/mu-search';
import {
  QueryStateManager,
  URL_PARAM_FIELDS,
} from 'frontend-poc-participatie/utils/query-state';

import ZoekController from 'frontend-poc-participatie/controllers/zoek';

// import type RouterService from '@ember/routing/router-service';
// type Transition = ReturnType<RouterService.transitionTo]>;
type Transition = any;
type RouteQueryParam = any;
type RouteQueryParams = { [key: string]: RouteQueryParam };
type ZoekModel = ArrayProxy<SearchResult>;

export default class ZoekRoute extends Route<ZoekModel> {
  qsm = new QueryStateManager();

  queryParams: RouteQueryParams = {};

  constructor() {
    super(...arguments);

    // See <https://guides.emberjs.com/release/routing/query-params/> and constructor.
    // Trigger model refresh when query parameters change, all query parameters
    // will be an argument to `this.model`.
    URL_PARAM_FIELDS.forEach((field) => {
      this.queryParams[field] = { refreshModel: true };
    });
  }

  // Add same QueryStateManager to controller
  setupController(
    controller: ZoekController,
    model: ZoekModel,
    transition: Transition
  ) {
    super.setupController(controller, model, transition);
    controller.qsm = this.qsm;
  }

  beforeModel(transition: Transition) {
    let queryParams = transition.to.queryParams;
    queryParams.page = queryParams.page ? queryParams.page : undefined;
    queryParams = this.qsm.filterOutDefaultValues(queryParams);
    queryParams = this.qsm.resetPageIfFieldsChanged(queryParams);

    this.transitionTo({ queryParams });
  }

  async model(params: RouteQueryParams) {
    // Update query state with URL query parameters
    // See <https://guides.emberjs.com/release/routing/query-params/> and constructor.
    this.qsm.updateFromURLQueryParams(<any>params);

    const { page, size, sort, query } = this.qsm.toMuSearchParams();

    return await muSearch(
      '/search/agendapunten',
      page,
      size,
      sort,
      query,
      function (item) {
        item.attributes.id = item.id;
        return item.attributes;
      }
    );
  }
}
