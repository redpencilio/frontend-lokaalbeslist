import Component from '@glimmer/component';
import {
  AGENDA_POINT_ATTRIBUTES,
  iterate,
} from 'frontend-poc-participatie/utils/attributes';
import { SearchResult } from 'frontend-poc-participatie/utils/search-result';

interface Args {
  result: SearchResult;
  highlight: { [key: string]: string[] | undefined };
}

export default class SearchResultMatchPreviewsComponent extends Component<Args> {
  get AGENDA_POINT_ATTRIBUTES() {
    return AGENDA_POINT_ATTRIBUTES;
  }

  get fields() {
    const fields = iterate(AGENDA_POINT_ATTRIBUTES.attributes);
    const highlight = this.args.highlight;
    const ignoreIfOnlyMatch = fields.any(
      ({ key, config }) => config.previews?.display === true || !!highlight[key]
    );

    return fields
      .filter(({ config }) => {
        let display = config.previews?.display || false;
        return ignoreIfOnlyMatch ? display === true : display;
      })
      .filter(({ key }) => highlight[key]);
  }
}
