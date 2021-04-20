import Controller from '@ember/controller';
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
const HAS_FIELD_MAPPING = {
  hasZitting: 'zitting',
  hasHandling: 'handling',
};

export default class ZoekController extends Controller {
  @service router;

  // QueryStateManager, see setupController in Zoek Route.
  // Most of it's state properties are tracked and trigger re-renders here.
  qsm;

  // ---------
  // Filtering
  // ---------

  @action
  updateFilters({ zoekterm, hasZitting, hasHandling }) {
    // Create array of ["zitting", "handling"]
    const has = Object.entries({ hasHandling, hasZitting })
      .filter(([_key, value]) => value)
      .map(([key, _value]) => HAS_FIELD_MAPPING[key]);

    this.router.transitionTo({
      queryParams: {
        search: zoekterm,
        has,
      },
    });
  }

  get filterFields() {
    const has = new Set(this.qsm.state.has.split(','));
    return {
      zoekterm: this.search,
      hasZitting: has.has('zitting'),
      hasHandling: has.has('handling'),
    };
  }

  // -------
  // Sorting
  // -------

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
    const sort = this.qsm.state.sort || SORT_OPTIONS_DEFAULT;

    // Remove asc/desc sign
    return sort[0] === '-' ? sort.substring(1) : sort;
  }

  get SORT_OPTIONS() {
    return SORT_OPTIONS;
  }
}
