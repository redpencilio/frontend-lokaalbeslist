import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { timeout } from 'ember-concurrency';
import { restartableTask, task } from 'ember-concurrency-decorators';
import Store from '@ember-data/store';

import { filterOutCompositeAreas } from 'frontend-lokaalbeslist/models/werkingsgebied';
import { taskFor } from 'ember-concurrency-ts';


interface Args {
  selected: string[];
  onSelectionChange(ids: string[]): void;
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
export default class SearchFilterGovernanceAreaSelect extends Component<Args> {
  @service declare store: Store;

  @tracked selected: string[] | null = null;
  @tracked options: string[] | null = null;

  constructor(owner: unknown, args: Args) {
    super(owner, args);
    taskFor(this.loadData).perform();
  }

  @task
  *loadData(): Generator<string[]> {
    this.options = this.store
      .query('werkingsgebied', {
        sort: 'naam',
      })
      .filter(filterOutCompositeAreas)
      .map((area) => area.naam)
      .uniq();

    this.updateSelectedValue();

    return this.options;
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
