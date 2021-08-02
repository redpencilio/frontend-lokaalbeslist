import Component from '@glimmer/component';
import { restartableTask, task } from 'ember-concurrency-decorators';
import { filterOutCompositeAreas } from 'frontend-lokaalbeslist/models/werkingsgebied';
import { timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import { action } from '@ember/object';

export default class FilterComponent extends Component {
  @service declare store: Store;

  @tracked
  governanceAreas: string[] = [];

  @tracked
  selectedGovernanceArea: string = 'Langemark-Poelkapelle';

  @tracked
  advancedFilters: boolean = true;

  @task
  *loadData(): Generator<Promise<string[]>> {
    this.governanceAreas = this.store
      .query('werkingsgebied', {
        sort: 'naam',
      })
      .filter(filterOutCompositeAreas)
      .map((area) => area.naam)
      .uniq();
  }

  @restartableTask
  *searchGovernanceArea(term: string) {
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
  changeSelectedGovernanceArea(value: string): void {
    this.selectedGovernanceArea = value;
  }
}
