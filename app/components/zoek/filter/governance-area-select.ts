import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { timeout } from 'ember-concurrency';
import { task, restartableTask } from 'ember-concurrency-decorators';
import Store from '@ember-data/store';
import Werkingsgebied from 'frontend-poc-participatie/models/werkingsgebied';

interface Args {
  selected: string[];
  onSelectionChange(ids: string[]): void;
}

function filterOutCompositeAreas(area: Werkingsgebied): boolean {
  return !area.naam.includes(' - ');
}

/**
 * We filter out any composite areas, such as 'Gent - Deinze - Lievegem'
 * in the displaying of the options. We consider when users type in 'Gent' they
 * want to match all composite areas that include 'Gent'.
 *
 * We work with pure strings here, instead of Werkingsgebieden.
 * This way we:
 * - Put pretty names in the URL query parameters
 * - Copy directly from the URL into the 'selected' argument without needing to talk to mu-resource
 * - **Can let ElasticSearch also match composite areas ** (as opposed to matching on id's)
 *
 */
export default class ZoekFilterGovernanceAreaSelect extends Component<Args> {
  @service declare store: Store;

  @tracked selected: string[] | null = null;
  @tracked options: string[] | null = null;

  constructor() {
    // @ts-ignore
    super(...arguments);
    // @ts-ignore
    this.loadData.perform();
  }

  @task
  *loadData(): Generator<Promise<string[]>> {
    const options = yield this.store
      .query('werkingsgebied', {
        sort: 'naam',
      })
      .then((areas) => areas.filter(filterOutCompositeAreas))
      .then((areas) => areas.map((area) => area.naam))
      .then((areas) => areas.uniq());

    // @ts-ignore
    this.options = options;
    this.updateSelectedValue();
  }

  @restartableTask
  *search(term: string) {
    yield timeout(600);
    return this.store
      .query('werkingsgebied', {
        sort: 'naam',
        filter: term,
      })
      .then((areas) => areas.filter(filterOutCompositeAreas))
      .then((areas) => areas.map((area) => area.naam))
      .then((areas) => areas.uniq());
  }

  @action
  changeSelected(selected: string[]) {
    this.selected = selected;
    this.args.onSelectionChange(selected);
  }

  /**
   * Fetch resources corresponding to selected id's as given by the component
   * arguments.
   */
  @action
  async updateSelectedValue() {
    if (this.args.selected.length && !this.selected) {
      this.selected = this.args.selected;
    } else if (!this.args.selected) {
      this.selected = null;
    }
  }
}
