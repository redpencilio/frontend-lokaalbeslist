import Component from '@glimmer/component';

import { SearchResult } from 'frontend-poc-participatie/utils/search-result';

interface Arguments {
  result: SearchResult;
}

/**
 * A single `AgendaPoint` search result
 */
export default class SearchResultComponent extends Component<Arguments> {}
