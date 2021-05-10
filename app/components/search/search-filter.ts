import Component from '@glimmer/component';
import { action } from '@ember/object';
import { debounce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';

import cloneDeep from 'lodash.clonedeep';
import { QueryState } from 'frontend-poc-participatie/utils/query-state';

interface Args {
  currentState: QueryState;
  updateFilters(filters: QueryState): void;
}

export default class ZoekZoekFilterComponent extends Component<Args> {
  @service declare store: Store;

  state: QueryState = cloneDeep(this.args.currentState);

  get selectedAdministrativeUnits() {
    return Array.from(this.args.currentState.administrativeUnit.selected);
  }

  get selectedGovernanceAreas() {
    return Array.from(this.args.currentState.governanceArea.selected);
  }

  @action
  update(property: string, value: any, config?: { debounced: boolean }) {
    // @ts-ignore
    this.state[property] = value;
    this.propagate(config);
  }

  @action
  updateSearch(event: Event) {
    this.state.search = (event.target as any).value;
    this.propagate({ debounced: true });
  }

  @action
  updateAdministrativeUnits(administrativeUnits: string[]) {
    this.state.administrativeUnit.selected = new Set(administrativeUnits);
    this.propagate();
  }

  @action
  updateGovernanceAreas(governanceAreas: string[]) {
    this.state.governanceArea.selected = new Set(governanceAreas);
    this.propagate();
  }

  propagate({ debounced }: { debounced: boolean } = { debounced: false }) {
    if (debounced) {
      debounce(this, this.propagate_, 250);
    } else {
      this.propagate_();
    }
  }

  propagate_() {
    this.args.updateFilters(this.state);
  }
}
