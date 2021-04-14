import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

const SORT_OPTIONS_DEFAULT = 'relevance';
const SORT_OPTIONS = {
  relevance: {
    text: 'Relevantie',
    ascending: true,
  },
  zittingPlannedStart: {
    text: 'Geplande datum',
    ascending: false,
  },
};

export default class SortButtonComponent extends Component {
  @service router;

  @action
  optionSelected(event) {
    let id = event.target.value;
    let option = this.SORT_OPTIONS[id];
    let asc = option.ascending ? '' : '-';

    // When it's the default option, set it to undefined so we clear the URL
    // otherwise prepend asc/desc modifier.
    let sort = id == SORT_OPTIONS_DEFAULT ? undefined : `${asc}${id}`;

    return this.router.transitionTo({ queryParams: { sort } });
  }

  get SORT_OPTIONS() {
    return SORT_OPTIONS;
  }

  /**
   * Currently selected sort option
   */
  get selected() {
    // Get sort query parameter
    const param = this.router.currentRoute.queryParams.sort;

    // Remove asc/desc sign
    const option = param && param[0] === '-' ? param.substring(1) : param;

    // If it's undefined get the default option
    return option ? option : SORT_OPTIONS_DEFAULT;
  }
}
