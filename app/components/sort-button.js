import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

const SORT_OPTIONS = {
  relevance: {
    default: true,
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
    let sort = option.default ? undefined : `${asc}${id}`; // This way empty the parameter instead of explicitly setting it to the default
    return this.router.transitionTo({ queryParams: { sort } });
  }

  get SORT_OPTIONS() {
    return SORT_OPTIONS;
  }
}
