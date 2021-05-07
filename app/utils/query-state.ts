import { tracked } from '@glimmer/tracking';
import { Sort } from './mu-search';

/**
 * The logic for a single query parameter,such as `search`, `isHandled` or `sort.
 *
 * Convert from and to URL representation, and generate mu-search filter parameters.
 *
 * Most of the methods should be overridden by instances
 */
export class QueryParameter<ValueType, URLType> {
  /**
   * A default state so we can reset back each parameter when it is emptied by the user.
   */
  declare default: ValueType;

  /**
   * Convert from the URL representation of this parameter to the JS representation
   * @param value the URL parameter value
   */
  fromURLParam(value: URLType): ValueType {
    // This likely needs to be overridden by instances
    return ((value || this.default) as unknown) as ValueType;
  }

  /**
   * Convert from the JS representation of this parameter to the URL representation
   * @param value the parameter value
   */
  toURLParam(value: ValueType): URLType {
    // This likely needs to be overridden by instances
    return (value as unknown) as URLType;
  }

  /**
   * Generate mu-search query parameters with respect to the parameter value
   *
   * @param value the parameter value
   */
  toMuSearchParams(_value: ValueType): { [key: string]: string } {
    // This likely needs to be overridden by instances
    return {};
  }

  constructor(conf: {
    default: ValueType;
    fromURLParam?: (value: URLType) => ValueType;
    toURLParam?: (value: ValueType) => URLType;
    toMuSearchParams?: (value: ValueType) => { [key: string]: string };
  }) {
    Object.assign(this, conf);
  }
}

type IsHandled = 'no' | 'yes' | undefined;

const QUERY_PARAMETERS = {
  page: new QueryParameter<number, number | undefined>({ default: 0 }),
  size: new QueryParameter<number, number | undefined>({ default: 20 }),
  sort: new QueryParameter<Sort, string | undefined>({
    default: undefined,
    fromURLParam(value: string | undefined) {
      return value
        ? {
            field: value.substr(1),
            isDesc: value[0] === '-',
          }
        : this.default;
    },
    toURLParam: (value) =>
      value ? `${value.isDesc ? '-' : ''}${value.field}` : undefined,
  }),

  /**
   * Main search filter
   */
  search: new QueryParameter<string | undefined, string | undefined>({
    default: undefined,
    fromURLParam: (value) => value,
    toMuSearchParams: (value) => ({ ':sqs:': value ? value : '*' }),
  }),

  /**
   * Wether the Agendapunt should be already be handled or not
   */
  isHandled: new QueryParameter<IsHandled, IsHandled>({
    default: undefined,
    fromURLParam(value: IsHandled) {
      return value || this.default;
    },
    toMuSearchParams(value) {
      let query: { [key: string]: string } = {};
      if (value) {
        if (value === 'yes') {
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
      return query;
    },
  }),

  /**
   * What Bestuurseenheden the users cares about
   */
  administrativeUnit: new QueryParameter<
    { selected: Set<string> },
    string | undefined
  >({
    default: { selected: new Set<string>() },
    fromURLParam(value) {
      return {
        selected: value ? new Set(value.split(',')) : this.default.selected,
      };
    },
    toURLParam: (value) => Array.from(value.selected).join(','),
    toMuSearchParams(value: { selected: Set<string> }) {
      let query: { [key: string]: string } = {};
      if (value.selected.size > 0) {
        query[`:terms:zitting.administrativeUnit.uuid`] = Array.from(
          value.selected
        ).join(',');
      }
      return query;
    },
  }),

  /**
   * What Werkingsgebieden the users cares about
   */
  governanceArea: new QueryParameter<
    { selected: Set<string> },
    string | undefined
  >({
    default: { selected: new Set<string>() },
    fromURLParam(value: string | undefined) {
      return {
        selected: value ? new Set(value.split(',')) : this.default.selected,
      };
    },
    toURLParam(value: { selected: Set<string> }): string {
      return Array.from(value.selected).join(',');
    },
    toMuSearchParams(value) {
      let query: { [key: string]: string } = {};
      if (value.selected.size > 0) {
        query[`zitting.governanceArea.label`] = Array.from(value.selected).join(
          ','
        );
      }
      return query;
    },
  }),

  /**
   * Which fields & relations should be present
   */
  has: new QueryParameter<Set<string>, string | undefined>({
    default: new Set<string>(),
    fromURLParam(value) {
      return value ? new Set(value.split(',')) : this.default;
    },
    toURLParam: (value) => Array.from(value).join(','),
    toMuSearchParams(value) {
      let query: { [key: string]: string } = {};
      value.forEach((attributeId) => {
        query[`:has:${attributeId}`] = 't';
      });
      return query;
    },
  }),
};

/**
 * The state of the search query.
 */
export type QueryState = {
  // Construct the type of the query state, by taking the ValueType of each
  // key in the QueryParameters.
  // We do this through taking the return type of the fromURLParam method
  [key in keyof typeof QUERY_PARAMETERS]: ReturnType<
    typeof QUERY_PARAMETERS[key]['fromURLParam']
  >;
};

/**
 * A list of URL parameter fields that we want to track,
 * these are the same properties of {@see QueryState}.
 */
export const URL_PARAM_FIELDS: (keyof typeof QUERY_PARAMETERS)[] = Object.keys(
  QUERY_PARAMETERS
) as any;

export type ExpectedURLQueryParams = Partial<
  {
    // Construct the type of the query state, by taking the URLType of each
    // key in the QueryParameters.
    // We do this through taking the return type of the toURLParam method
    [key in keyof typeof QUERY_PARAMETERS]: ReturnType<
      typeof QUERY_PARAMETERS[key]['toURLParam']
    >;
  }
>;

function defaultQueryState(): QueryState {
  const qs: QueryState = {} as any;

  let field: keyof typeof QUERY_PARAMETERS;
  for (field in QUERY_PARAMETERS) {
    const parameter: QueryParameter<any, any> = QUERY_PARAMETERS[field];
    // @ts-ignore TODO Fix clone
    qs[field] = parameter.default;
  }

  return qs;
}

/**
 * Manage query state such as filters, pagination and sorting info.
 */
export class QueryStateManager {
  @tracked state: QueryState = defaultQueryState();

  // Keep track of wether this is an initial page load
  // (e.g. on page refresh or a regular initial visit),
  // so we can know when parameters are different from the default due to
  // user actions or due to the initial URL.
  isInitialPageLoad = true;

  updateFromURLQueryParams(params: ExpectedURLQueryParams) {
    this.isInitialPageLoad = false;

    let field: keyof typeof params;
    for (field in params) {
      const param: any = params[field];
      // @ts-ignore TODO fix ignore
      this.state[field] = QUERY_PARAMETERS[field].fromURLParam(param);
    }

    // This way @tracked always updates
    this.state = { ...this.state };
  }

  toURLQueryParams(state: QueryState): ExpectedURLQueryParams {
    const params: ExpectedURLQueryParams = {} as any;

    let field: keyof typeof state;
    for (field in state) {
      const param: any = state[field];
      // @ts-ignore TODO fix ignore
      params[field] = QUERY_PARAMETERS[field].toURLParam(param);
    }

    return params;
  }

  toMuSearchParams(): { page: number; size: number; sort: Sort; query: any } {
    const query: { [key: string]: string } = {};

    let field: keyof QueryStateManager['state'];
    for (field in this.state) {
      const param: any = this.state[field];
      // @ts-ignore TODO fix ignore
      const partialQuery = QUERY_PARAMETERS[field].toMuSearchParams(param);

      Object.assign(query, partialQuery);
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
  defaultQueryState()
);
