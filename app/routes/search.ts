import Route from '@ember/routing/route';
import ArrayProxy from '@ember/array/proxy';

import { SearchResult } from 'frontend-poc-participatie/utils/search-result';
import muSearch from 'frontend-poc-participatie/utils/mu-search';
import {
  QueryStateManager,
  URL_PARAM_FIELDS,
} from 'frontend-poc-participatie/utils/query-state';

import SearchController from 'frontend-poc-participatie/controllers/search';

// import type RouterService from '@ember/routing/router-service';
// type Transition = ReturnType<RouterService.transitionTo]>;
type Transition = any;
type RouteQueryParam = any;
type RouteQueryParams = { [key: string]: RouteQueryParam };
type SearchModel = ArrayProxy<SearchResult>;

export default class SearchRoute extends Route<SearchModel> {
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
    controller: SearchController,
    model: SearchModel,
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

    const { page, size, sort, query, highlight } = this.qsm.toMuSearchParams();

    return await muSearch(
      '/search/agendapunten',
      page,
      size,
      sort,
      query,
      highlight,
      (item) => {
        item.attributes.id = item.id;
        return item;
      }
    );
  }
}
