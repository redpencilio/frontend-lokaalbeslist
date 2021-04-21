import Route from '@ember/routing/route';
import ArrayProxy from '@ember/array/proxy';
import { tracked } from '@glimmer/tracking';

import muSearch from '../utils/mu-search';
import { SearchResult } from 'frontend-poc-participatie/utils/search-result';
import ZoekController from 'frontend-poc-participatie/controllers/zoek';

// import type RouterService from '@ember/routing/router-service';
// type Transition = ReturnType<RouterService.transitionTo]>;
type Transition = any;
type RouteQueryParam = any;
type RouteQueryParams = { [key: string]: RouteQueryParam };
type ZoekModel = ArrayProxy<SearchResult>;

export default class ZoekRoute extends Route<ZoekModel> {
  qsm = new QueryStateManager();

  constructor() {
    super(...arguments);

    // See <https://guides.emberjs.com/release/routing/query-params/> and constructor.
    // Trigger model refresh when query parameters change, all query parameters
    // will be an argument to `this.model`.
    PARAM_FIELDS.forEach((field) => {
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
    queryParams = this.qsm.resetPageIfFieldsChanged(queryParams);
    queryParams = this.qsm.filterOutDefaultValues(queryParams);

    this.transitionTo({ queryParams });
  }

  async model(params: RouteQueryParams) {
    // Update query state with URL query parameters
    // See <https://guides.emberjs.com/release/routing/query-params/> and constructor.
    this.qsm.updateFromURLQueryParams(params);

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

const PARAM_FIELDS = ['page', 'size', 'sort', 'has', 'search'];
const DEFAULT_PARAMS = {
  page: 0,
  size: 20,
  sort: undefined, // string `-field` or `field`

  search: '', // string
  has: '', // "zitting,handling"] | "zitting" | ...
};

/**
 * POJO that is a class so we can use @tracked
 */
class QueryState {
  @tracked page = DEFAULT_PARAMS.page;
  @tracked size = DEFAULT_PARAMS.size;
  @tracked sort = DEFAULT_PARAMS.sort;
  @tracked search = DEFAULT_PARAMS.search;
  @tracked has = DEFAULT_PARAMS.has;
}

/**
 * Manage query state such as filters, pagination and sorting info.
 */
export class QueryStateManager {
  @tracked state = new QueryState();

  // Keep track of wether this is an initial page load
  // (e.g. on page refresh or a regular initial visit),
  // so we can know when parameters are different from the default due to
  // user actions or due to the initial URL.
  isInitialPageLoad = true;

  updateFromURLQueryParams(params: any) {
    this.state.page = params.page || DEFAULT_PARAMS.page;
    this.state.sort = params.sort;
    this.state.size = params.size || DEFAULT_PARAMS.size;

    this.state.search = params.search;
    this.state.has = params.has || DEFAULT_PARAMS.has;

    this.isInitialPageLoad = false;
  }

  toMuSearchParams(): {
    page: number;
    size: number;
    sort: string | undefined;
    query: any;
  } {
    const query: { [key: string]: string } = {};

    query[':sqs:'] = this.state.search ? this.state.search : '*';

    this.state.has
      .split(',')
      .filter((attr) => attr) // Deal with empty string
      .forEach((attributeId) => {
        query[`:has:${attributeId}`] = 't';
      });

    const { page, size, sort } = this.state;
    return { page, size, sort, query };
  }

  filterOutDefaultValues(params: RouteQueryParams) {
    for (let field of Object.keys(params)) {
      if (Object.prototype.hasOwnProperty.call(params, field)) {
        // @ts-ignore
        if (params[field] === DEFAULT_PARAMS[field]) {
          params[field] = undefined;
        }
      }
    }
    return params;
  }

  /**
   * If any field changed, the page should be reset.
   *
   * Note: this does not update the QSM state.
   *
   * @param {object} params Query parameters
   * @returns An empty object or an object `{page: undefined}` when the page
   * needs to be reset.
   */
  resetPageIfFieldsChanged(params: RouteQueryParams) {
    return this.shouldPageBeReset(params)
      ? { ...params, page: undefined }
      : params;
  }

  /**
   * If any field changed, the page should be reset.
   */
  shouldPageBeReset(params: RouteQueryParams) {
    if (this.isInitialPageLoad) {
      return false;
    }

    for (let field of Object.keys(params)) {
      if (field === 'page') {
        continue;
      }

      // @ts-ignore
      if (params[field] !== this.state[field]) {
        return true;
      }
    }
    return false;
  }
}
