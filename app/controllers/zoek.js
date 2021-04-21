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

export default class ZoekController extends Controller {
  @service router;

  // QueryStateManager, see setupController in Zoek Route.
  // Most of it's state properties are tracked and trigger re-renders here.
  qsm;

  // ---------
  // Filtering
  // ---------

  @action
  updateFilters({ search, has }) {
    // Create array ["zitting", "handling", ...] from object {zitting: true, handling: true, ...}
    const hasAsArray = Object.entries(has)
      .filter(([_id, value]) => value)
      .map(([id, _value]) => id);

    this.router.transitionTo({
      queryParams: {
        search,
        has: hasAsArray,
      },
    });
  }

  get filterFields() {
    // Create object {zitting: true, handling: true, ...} from ["zitting", "handling"]
    const has = this.qsm.state.has.split(',').reduce((acc, attributeId) => {
      acc[attributeId] = true;
      return acc;
    }, {});

    const { search } = this.qsm.state;

    return {
      search,
      has,
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
