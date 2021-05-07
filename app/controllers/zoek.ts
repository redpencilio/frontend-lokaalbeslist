import Controller from '@ember/controller';
import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

import {
  QueryState,
  QueryStateManager,
} from 'frontend-poc-participatie/utils/query-state';

const SORT_OPTIONS_DEFAULT = 'relevance';
const SORT_OPTIONS = {
  relevance: {
    text: 'Relevantie',
    ascending: true,
  },
  'zitting.plannedStart': {
    text: 'Geplande datum',
    ascending: false,
  },
};

export default class ZoekController extends Controller {
  @service declare router: RouterService;

  // QueryStateManager, see setupController in Zoek Route.
  // Most of it's state properties are tracked and trigger re-renders here.
  declare qsm: QueryStateManager;

  // ---------
  // Filtering
  // ---------

  @action
  updateFilters(filterState: QueryState) {
    const queryParams = this.qsm.toURLQueryParams(filterState);
    this.router.transitionTo({ queryParams });
  }

  // -------
  // Sorting
  // -------

  @action
  updateSort(id: 'relevance' | 'zitting.plannedStart') {
    const option = SORT_OPTIONS[id];
    const asc = option.ascending ? '' : '-';

    // When it's the default option, set it to undefined so we clear the URL
    // otherwise prepend asc/desc modifier.
    let sort = id == SORT_OPTIONS_DEFAULT ? undefined : `${asc}${id}`;

    // Change URL
    return this.router.transitionTo({ queryParams: { sort } });
  }

  get currentSortOption() {
    return this.qsm.state.sort?.field || SORT_OPTIONS_DEFAULT;
  }

  get SORT_OPTIONS() {
    return SORT_OPTIONS;
  }
}
