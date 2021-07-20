import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task, TaskGenerator, timeout } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import { restartableTask } from 'ember-concurrency-decorators';
import Store from '@ember-data/store';
import Bestuurseenheid from 'frontend-poc-participatie/models/bestuurseenheid';
import ArrayProxy from '@ember/array/proxy';

interface SearchFilterAdministrativeUnitSelectArgs {
  selected: string[];
  onSelectionChange(ids: string[]): void;
}

export default class SearchFilterAdministrativeUnitSelect extends Component<SearchFilterAdministrativeUnitSelectArgs> {
  @service declare store: Store;

  @tracked selected: Bestuurseenheid[] | null = null;
  @tracked options: ArrayProxy<Bestuurseenheid> | null = null;

  constructor(owner: unknown, args: SearchFilterAdministrativeUnitSelectArgs) {
    super(owner, args);
    taskFor(this.loadData).perform();
  }

  @task
  *loadData(): TaskGenerator<ArrayProxy<Bestuurseenheid>> {
    this.options = this.store.query('bestuurseenheid', {
      sort: 'naam',
      include: 'classificatie',
    });

    this.updateSelectedValue();

    return this.options;
  }

  @restartableTask
  *search(term: string) {
    yield timeout(600);
    return this.store.query('bestuurseenheid', {
      sort: 'naam',
      include: 'classificatie',
      filter: term,
    });
  }

  @action
  changeSelected(selected: Bestuurseenheid[]) {
    this.selected = selected;
    this.args.onSelectionChange(selected && selected.map((d) => d.get('id')));
  }

  /**
   * Fetch resources corresponding to selected id's as given by the component
   * arguments.
   */
  @action
  async updateSelectedValue() {
    if (this.args.selected.length && !this.selected) {
      this.selected = (
        await this.store.query('bestuurseenheid', {
          include: 'classificatie',
          filter: { ':id:': this.args.selected.join(',') },
          size: { size: this.args.selected.length },
        })
      ).toArray();
    } else if (!this.args.selected) {
      this.selected = null;
    }
  }
}
