import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { timeout } from 'ember-concurrency';
import { task, restartableTask } from 'ember-concurrency-decorators';
import Store from '@ember-data/store';
import Bestuurseenheid from 'frontend-poc-participatie/models/bestuurseenheid';
import ArrayProxy from '@ember/array/proxy';

interface ZoekFilterAdministrativeUnitSelectArgs {
  selected: string[];
  onSelectionChange(ids: string[]): void;
}

export default class ZoekFilterAdministrativeUnitSelect extends Component<ZoekFilterAdministrativeUnitSelectArgs> {
  @service declare store: Store;

  @tracked selected: Bestuurseenheid[] | null = null;
  @tracked options: ArrayProxy<Bestuurseenheid> | null = null;

  constructor() {
    // @ts-ignore
    super(...arguments);
    // @ts-ignore
    this.loadData.perform();
  }

  @task
  *loadData(): Generator<ArrayProxy<Bestuurseenheid>> {
    const options = yield this.store.query('bestuurseenheid', {
      sort: 'naam',
      include: 'classificatie',
    });

    // @ts-ignore
    this.options = options;
    this.updateSelectedValue();
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
    this.args.onSelectionChange(selected && selected.map((d) => d.get('uri')));
  }

  /**
   * Fetch resources corresponding to selected id's as given by the component
   * arguments.
   */
  @action
  async updateSelectedValue() {
    if (this.args.selected.length && !this.selected) {
      console.log(this.args.selected, this.selected);
      this.selected = (
        await this.store.query('bestuurseenheid', {
          include: 'classificatie',
          filter: { ':uri:': this.args.selected.join(',') },
          size: { size: this.args.selected.length },
        })
      ).toArray();
    } else if (!this.args.selected) {
      this.selected = null;
    }
  }
}
