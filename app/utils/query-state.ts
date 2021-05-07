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
  'search',
  'isHandled',
  'administrativeUnit',
  'governanceArea',
  'has',
];
interface ExpectedURLQueryParams {
  sort?: string | undefined;
  page?: number | undefined;
  size?: number | undefined;

  search?: string | undefined;
  isHandled?: 'no' | 'yes' | undefined;
  administrativeUnit?: string | undefined;
  governanceArea?: string | undefined;
  has?: string | undefined;
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
  isHandled: 'no' | 'yes' | undefined = DEFAULT_STATE.isHandled;
  administrativeUnit: { selected: Set<string> } =
    DEFAULT_STATE.administrativeUnit;
  governanceArea: { selected: Set<string> } = DEFAULT_STATE.governanceArea;

  has: Set<string> = DEFAULT_STATE.has;
}

/**
 * A default state so we can reset back each parameter when it is emptied by the user.
 */
const DEFAULT_STATE = {
  sort: undefined,
  page: 0,
  size: 20,
  search: undefined,
  isHandled: undefined,
  administrativeUnit: { selected: new Set<string>() },
  governanceArea: { selected: new Set<string>() },
  has: new Set<string>(),
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
    this.state.isHandled = params.isHandled || DEFAULT_STATE.isHandled;
    this.state.administrativeUnit = {
      selected: params.administrativeUnit
        ? new Set(params.administrativeUnit.split(','))
        : DEFAULT_STATE.administrativeUnit.selected,
    };
    this.state.governanceArea = {
      selected: params.governanceArea
        ? new Set(params.governanceArea.split(','))
        : DEFAULT_STATE.governanceArea.selected,
    };
    this.state.has = params.has
      ? new Set(params.has.split(','))
      : DEFAULT_STATE.has;

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
      administrativeUnit: Array.from(state.administrativeUnit.selected).join(
        ','
      ),
      governanceArea: Array.from(state.governanceArea.selected).join(','),
      has: Array.from(state.has).join(','),
    };
  }

  toMuSearchParams(): { page: number; size: number; sort: Sort; query: any } {
    const query: { [key: string]: string } = {};

    query[':sqs:'] = this.state.search ? this.state.search : '*';

    this.state.has.forEach((attributeId) => {
      query[`:has:${attributeId}`] = 't';
    });

    if (this.state.administrativeUnit.selected.size > 0) {
      query[`:terms:zitting.administrativeUnit.uuid`] = Array.from(
        this.state.administrativeUnit.selected
      ).join(',');
    }

    if (this.state.governanceArea.selected.size > 0) {
      query[`zitting.governanceArea.label`] = Array.from(
        this.state.governanceArea.selected
      ).join(',');
    }

    if (this.state.isHandled) {
      if (this.state.isHandled === 'yes') {
        // We expect both a zitting and a handling here, GTFO dirty data.
        query[':has:zitting'] = 't';
        query[':has:agendaItemHandling'] = 't';
      } else {
        // It could be that there is no associated agendaItemHandlingthe but the
        // agenda item is handled in practice (e.g. in Zitting notulen).
        // We can't filter out those out, because we can't filter out those with
        // associated Zittingen, because the Zitting can be planned for the future.
        // We could filter out those with Zittingen that already happened, but
        // maybe the agenda point was not actually talked about?
        query[':has-no:agendaItemHandling'] = 't';
      }
    }

    const { page, size, sort } = this.state;
    return { page, size, sort, query };
  }

  filterOutDefaultValues(params: ExpectedURLQueryParams) {
    for (let field of URL_PARAM_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(params, field)) {
        if (params[field] !== undefined) {
          if (
            params[field] === DEFAULT_URL_STATE[field]?.toString() ||
            params[field] === ''
          ) {
            params[field] = undefined;
          }
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
