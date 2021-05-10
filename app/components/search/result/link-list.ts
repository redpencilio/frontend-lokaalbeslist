import Component from '@glimmer/component';
import { SearchResult } from 'frontend-poc-participatie/utils/search-result';

interface Args {
  result: SearchResult;
}

export default class SearchResultLinkListComponent extends Component<Args> {
  get resolutions() {
    let resolutions = this.args.result.agendaItemHandling.generatedResolutions;
    if (!resolutions) {
      return [];
    }

    if (Array.isArray(resolutions)) {
      return resolutions.map((resolution, index) => ({
        link: resolution.uri,
        index: index + 1,
      }));
    } else {
      return [{ link: resolutions.uri, index: '' }];
    }
  }
}
