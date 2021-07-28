import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

import {
  QueryState,
  QueryStateManager,
  DEFAULT_URL_STATE,
} from 'frontend-lokaalbeslist/utils/query-state';

const SORT_OPTIONS_DEFAULT = 'relevance';
const SORT_OPTIONS = {
  relevance: {
    text: 'Relevantie',
    ascending: true,
  },
  'session.plannedStart': {
    text: 'Geplande datum',
    ascending: false,
  },
};

interface Args {
  model: any;
  qsm: any;
}

export default class SearchComponent extends Component<Args> {
  @service declare router: RouterService;

  // QueryStateManager, see setupController in Search Route.
  // Most of it's state properties are tracked and trigger re-renders here.
  get qsm(): QueryStateManager {
    return this.args.qsm;
  }

  // ---------
  // Filtering
  // ---------

  @action
  updateFilters(filterState: QueryState) {
    const queryParams = this.qsm.toURLQueryParams(filterState);
    this.router.transitionTo({ queryParams });
  }

  @action
  resetFilters() {
    this.router.transitionTo({ queryParams: DEFAULT_URL_STATE });
  }

  // -------
  // Sorting
  // -------

  @action
  updateSort(id: 'relevance' | 'session.plannedStart') {
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
