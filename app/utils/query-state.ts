import { tracked } from '@glimmer/tracking';
import { Sort } from './mu-search';

/**
 * A list of URL parameter fields that we want to track,
 * these are the same properties of {@see QueryState}.
 */
export const URL_PARAM_FIELDS: (keyof ExpectedURLQueryParams)[] = [
  'page',
  'size',
  'sort',
  'has',
  'search',
  'administrativeUnit',
];
interface ExpectedURLQueryParams {
  sort?: string | undefined;
  page?: number | undefined;
  size?: number | undefined;

  search?: string | undefined;
  has?: string | undefined;
  administrativeUnit?: string | undefined;
}

/**
 * The state of the search query.
 */
export class QueryState {
  sort: Sort = DEFAULT_STATE.sort;
  page: number = DEFAULT_STATE.page;
  size: number = DEFAULT_STATE.size;

  // Filters
  search: string | undefined = DEFAULT_STATE.search;
  has: Set<string> = DEFAULT_STATE.has;
  administrativeUnit: { selected: Set<string> } =
    DEFAULT_STATE.administrativeUnit;
}

/**
 * A default state so we can reset back each parameter when it is emptied by the user.
 */
const DEFAULT_STATE = {
  sort: undefined,
  page: 0,
  size: 20,
  search: undefined,
  has: new Set<string>(),
  administrativeUnit: { selected: new Set<string>() },
};

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

  updateFromURLQueryParams(params: ExpectedURLQueryParams) {
    this.state.page = params.page || DEFAULT_STATE.page;
    this.state.size = params.size || DEFAULT_STATE.size;
    this.state.sort = params.sort
      ? {
          field: params.sort.substr(1),
          isDesc: params.sort[0] === '-',
        }
      : DEFAULT_STATE.sort;

    this.state.search = params.search;
    this.state.has = params.has
      ? new Set(params.has.split(','))
      : DEFAULT_STATE.has;
    this.state.administrativeUnit = {
      selected: params.administrativeUnit
        ? new Set(params.administrativeUnit.split(','))
        : DEFAULT_STATE.administrativeUnit.selected,
    };

    this.isInitialPageLoad = false;

    // This way @tracked always updates
    this.state = { ...this.state };
  }

  toURLQueryParams(state: QueryState): ExpectedURLQueryParams {
    return {
      ...state,
      sort: state.sort
        ? `${state.sort.isDesc ? '-' : ''}${state.sort.field}`
        : undefined,
      has: Array.from(state.has).join(','),
      administrativeUnit: Array.from(state.administrativeUnit.selected).join(
        ','
      ),
    };
  }

  toMuSearchParams(): { page: number; size: number; sort: Sort; query: any } {
    const query: { [key: string]: string } = {};

    query[':sqs:'] = this.state.search ? this.state.search : '*';

    this.state.has.forEach((attributeId) => {
      query[`:has:${attributeId}`] = 't';
    });

    if (this.state.administrativeUnit.selected.size > 0) {
      query[`:terms:administrativeUnitURI`] = Array.from(
        this.state.administrativeUnit.selected
      ).join(',');
    }

    const { page, size, sort } = this.state;
    return { page, size, sort, query };
  }

  filterOutDefaultValues(params: ExpectedURLQueryParams) {
    for (let field of URL_PARAM_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(params, field)) {
        if (
          params[field] === DEFAULT_URL_STATE[field]?.toString() ||
          params[field] === ''
        ) {
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
  resetPageIfFieldsChanged(params: ExpectedURLQueryParams) {
    return this.shouldPageBeReset(params)
      ? { ...params, page: undefined }
      : params;
  }

  /**
   * If any field changed, the page should be reset.
   */
  shouldPageBeReset(params: ExpectedURLQueryParams) {
    if (this.isInitialPageLoad) {
      return false;
    }

    let state = this.toURLQueryParams(this.state);
    for (let field of Object.keys(params)) {
      if (field === 'page') {
        continue;
      }

      // @ts-ignore
      if (params[field] !== state[field]) {
        return true;
      }
    }
    return false;
  }
}

/**
 * The URL version of the default state, used for checking when default values
 * should be left out.
 */
const DEFAULT_URL_STATE = QueryStateManager.prototype.toURLQueryParams(
  DEFAULT_STATE
);
