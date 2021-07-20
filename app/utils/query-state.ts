import { tracked } from '@glimmer/tracking';
import { Highlight, Sort } from './mu-search';

/**
 * The logic for a single query parameter,such as `search`, `isHandled` or `sort`.
 *
 * Convert from and to URL representation, and generate mu-search filter parameters.
 *
 * Most of the methods should be overridden by instances
 */
export interface QueryParameter<ValueType, URLType> {
  defaultValue: ValueType;

  /**
   * Convert from the URL representation of this parameter to the JS representation.
   *
   * @param value The URL parameter value.
   */
  fromURLParam: (value: URLType | undefined) => ValueType;

  /**
   * Convert from the JS representation of this parameter to the URL representation
   *
   * @param value The parameter value.
   */
  toURLParam: (value: ValueType) => URLType | undefined;

  /**
   * Generate mu-search query parameters with respect to the parameter value.
   *
   * @param value The parameter value.
   */
  toMuSearchFilterParams: (value: ValueType) => { [key: string]: string }
}

class SimpleQueryParameter<T> implements QueryParameter<T, T>{
  defaultValue: T;

  fromURLParam(value: T): T {
    return value || this.defaultValue;
  }

  toURLParam(value: T): T {
    return value;
  }

  toMuSearchFilterParams(_value: T): { [key: string]: string } {
    return {};
  }

  constructor(defaultValue: T) {
    this.defaultValue = defaultValue;
  }
}

class SortQueryParameter implements QueryParameter<Sort, string> {
  defaultValue: Sort = undefined;

  fromURLParam(value: string | undefined) {
    return value
      ? {
        field: value.substr(1),
        isDesc: value[0] === '-',
      }
      : this.defaultValue;
  }

  toMuSearchFilterParams(_value: Sort): { [p: string]: string } {
    return {};
  }

  toURLParam(value: Sort): string | undefined {
    return value ? `${value.isDesc ? '-' : ''}${value.field}` : undefined
  }
}

class SearchQueryParameter implements QueryParameter<string | undefined, string> {
  defaultValue: string | undefined;

  fromURLParam(value: string | undefined): string | undefined {
    return value || this.defaultValue;
  }

  toMuSearchFilterParams(value: string | undefined): { [p: string]: string } {
    return { ':sqs:': value ? value : '*' };
  }

  toURLParam(value: string | undefined): string | undefined {
    return value;
  }
}

/**
 * Whether the Agendapunt should be already be handled or not
 */
class IsHandledQueryParameter implements QueryParameter<IsHandled | undefined, IsHandled> {
  defaultValue: IsHandled | undefined = undefined;

  fromURLParam(value: IsHandled | undefined): IsHandled | undefined {
    return value || this.defaultValue;
  }

  toMuSearchFilterParams(value: IsHandled): { [p: string]: string } {
    let query: { [key: string]: string } = {};
    if (value) {
      if (value === 'yes') {
        // We expect both a session and a handling here, GTFO dirty data.
        query[':has:session'] = 't';
        query[':has:agendaItemHandling'] = 't';
      } else {
        // It could be that there is no associated agendaItemHandling but the
        // agenda item is handled in practice (e.g. in Zitting notulen).
        // We can't filter out those out, because we can't filter out those with
        // associated Zittingen, because the Zitting can be planned for the future.
        // We could filter out those with Zittingen that already happened, but
        // maybe the agenda point was not actually talked about?
        query[':has-no:agendaItemHandling'] = 't';
      }
    }
    return query;
  }

  toURLParam(value: IsHandled): IsHandled | undefined {
    return value;
  }
}

/**
 * What Bestuurseenheden the users cares about
 */
class AdministrativeUnitQueryParameter implements QueryParameter<Selection, string> {
  defaultValue: Selection = { selected: new Set<string>() };

  fromURLParam(value: string | undefined): Selection {
    return {
      selected: value ? new Set(value.split(',')) : this.defaultValue.selected,
    };
  }

  toMuSearchFilterParams(value: Selection): { [p: string]: string } {
    let query: { [key: string]: string } = {};
    if (value.selected.size > 0) {
      query[`:terms:session.administrativeUnit.uuid`] = Array.from(
        value.selected
      ).join(',');
    }
    return query;
  }

  toURLParam(value: Selection): string | undefined {
    return Array.from(value.selected).join(',');
  }
}

/**
 * What Werkingsgebieden the users cares about
 */
class GovernanceAreaQueryParameter implements QueryParameter<Selection, string> {
  defaultValue: Selection = { selected: new Set<string>() };

  fromURLParam(value: string | undefined): Selection {
    return {
      selected: value ? new Set(value.split(',')) : this.defaultValue.selected,
    };
  }

  toMuSearchFilterParams(value: Selection): { [p: string]: string } {
    let query: { [key: string]: string } = {};
    if (value.selected.size > 0) {
      query[`session.governanceArea.label`] = Array.from(value.selected).join(
        ','
      );
    }
    return query;
  }

  toURLParam(value: Selection): string | undefined {
    return Array.from(value.selected).join(',');
  }

}

/**
 * Which fields & relations should be present
 */
class HasQueryParameter implements QueryParameter<Set<String>, string> {
  defaultValue: Set<String> = new Set<string>();

  fromURLParam(value: string | undefined): Set<String> {
    return value ? new Set(value.split(',')) : this.defaultValue;
  }

  toMuSearchFilterParams(value: Set<String>): { [p: string]: string } {
    let query: { [key: string]: string } = {};
    value.forEach((attributeId) => {
      query[`:has:${attributeId}`] = 't';
    });
    return query;
  }

  toURLParam(value: Set<String>): string | undefined {
    return Array.from(value).join(',');
  }
}

/**
 * What Werkingsgebieden the user cares about, as defined by the route
 * for embedding a gemeente-specifieke view of this application.
 */
class EmbeddedQueryParameter implements QueryParameter<Embedded, string> {
  defaultValue: Embedded = { isEmbedded: false };

  fromURLParam(value: string | undefined): Embedded {
    return value
      ? { isEmbedded: true, governanceArea: value }
      : { isEmbedded: false };
  }

  toMuSearchFilterParams(value: Embedded): { [p: string]: string } {
    let query: { [key: string]: string } = {};
    if (value.isEmbedded) {
      query[`session.governanceArea.label`] = value.governanceArea!;
    }
    return query;
  }

  toURLParam(_value: Embedded): string | undefined {
    return undefined;
  }

}

type IsHandled = 'no' | 'yes';

interface Embedded {
  isEmbedded: boolean,
  governanceArea?: string
}

interface Selection {
  selected: Set<string>
}

const QUERY_PARAMETERS = {
  page: new SimpleQueryParameter<number>(0),
  size: new SimpleQueryParameter<number>( 20),
  sort: new SortQueryParameter(),
  search: new SearchQueryParameter(),
  isHandled: new IsHandledQueryParameter(),
  administrativeUnit: new AdministrativeUnitQueryParameter(),
  governanceArea: new GovernanceAreaQueryParameter(),
  has: new HasQueryParameter(),
  embedded: new EmbeddedQueryParameter(),
};

type QueryParameterKey = keyof typeof QUERY_PARAMETERS;

type QueryParameterValueType<S> = S extends QueryParameter<infer T, infer _> ? T : never;
type QueryParameterURLType<S> = S extends QueryParameter<infer _, infer T> ? T : never;

/**
 * The state of the search query.
 */
export type QueryState = {
  [key in QueryParameterKey]: QueryParameterValueType<typeof QUERY_PARAMETERS[key]>;
};

/**
 * A list of URL parameter fields that we want to track,
 * these are the same properties of {@see QueryState}.
 */
export const URL_PARAM_FIELDS: (keyof typeof QUERY_PARAMETERS)[] =
  // All query parameters
  Object.keys(QUERY_PARAMETERS)
    // Filter out dynamic url path segments
    .filter((key) => key !== 'embedded') as any;

export type ExpectedURLQueryParams = Partial<
  {
    // Construct the type of the query state, by taking the URLType of each
    // key in the QueryParameters.
    [key in QueryParameterKey]: QueryParameterURLType<typeof QUERY_PARAMETERS[key]>;
  }
>;

export function defaultQueryState(): QueryState {
  //TODO use function and Partial<QueryState>
  const qs: QueryState = {} as any;

  let field: keyof typeof QUERY_PARAMETERS;
  for (field in QUERY_PARAMETERS) {
    const parameter: QueryParameter<any, any> = QUERY_PARAMETERS[field];
    // @ts-ignore TODO Fix clone
    qs[field] = parameter.defaultValue;
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
    //TODO: use Partial<>
    const params: ExpectedURLQueryParams = {} as any;

    let field: keyof typeof state;
    for (field in state) {
      if (field === 'embedded') {
        continue;
      }
      const param: any = state[field];
      // @ts-ignore TODO fix ignore
      params[field] = QUERY_PARAMETERS[field].toURLParam(param);
    }

    return params;
  }

  toMuSearchParams(): {
    page: number;
    size: number;
    sort: Sort;
    query: any;
    highlight: Highlight;
  } {
    const query: { [key: string]: string } = {};

    let field: keyof QueryStateManager['state'];
    for (field in this.state) {
      const param: any = this.state[field];
      const partialQuery = QUERY_PARAMETERS[field]
        // @ts-ignore TODO fix ignore
        .toMuSearchFilterParams(param);

      Object.assign(query, partialQuery);
    }

    const highlight = this.state.search ? { fields: ['*'] } : undefined;
    const { page, size, sort } = this.state;
    return { page, size, sort, query, highlight };
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
export const DEFAULT_URL_STATE = QueryStateManager.prototype.toURLQueryParams(
  defaultQueryState()
);
