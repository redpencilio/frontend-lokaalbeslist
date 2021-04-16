import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
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

export default class ZoekController extends Controller {
  @service
  router;

  // https://guides.emberjs.com/release/routing/query-params/
  queryParams = ['sort'];

  // -------
  // Sorting
  // -------

  @tracked
  sort = null;

  @action
  updateSort(id) {
    const option = SORT_OPTIONS[id];
    const asc = option.ascending ? '' : '-';

    // When it's the default option, set it to undefined so we clear the URL
    // otherwise prepend asc/desc modifier.
    let sort = id == SORT_OPTIONS_DEFAULT ? undefined : `${asc}${id}`;

    // Change URL
    return this.router.transitionTo({ queryParams: { sort } });
  }

  get currentSortOption() {
    // Get sort query parameter
    const param = this.router.currentRoute.queryParams.sort;

    // Remove asc/desc sign
    const option = param && param[0] === '-' ? param.substring(1) : param;

    // If it's undefined get the default option
    return option ? option : SORT_OPTIONS_DEFAULT;
  }

  get SORT_OPTIONS() {
    return SORT_OPTIONS;
  }
}
