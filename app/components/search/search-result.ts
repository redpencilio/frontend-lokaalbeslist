import Component from '@glimmer/component';

import { SearchResult } from 'frontend-poc-participatie/utils/search-result';

interface Arguments {
  result: SearchResult;
  highlight: { [key: string]: string };
}

/**
 * A single `AgendaPoint` search result
 */
export default class SearchResultComponent extends Component<Arguments> {
  get descriptionEqualToTitle() {
    return this.args.result.title === this.args.result.description;
  }
}