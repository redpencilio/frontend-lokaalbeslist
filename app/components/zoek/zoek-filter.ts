import { AGENDA_POINT_ATTRIBUTES, ENTITIES } from '../../utils/attributes';

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

  get AGENDA_POINT_ATTRIBUTES() {
    return AGENDA_POINT_ATTRIBUTES;
  }

  get ENTITIES() {
    return ENTITIES;
  }

  get selectedAdministrativeUnits() {
    return Array.from(this.args.currentState.administrativeUnit.selected);
  }

  /**
   * For updating **root** properties in a debounced manner.
   *
   * @param {string} property The property to update
   * @param {*} event The input event that triggered the update
   */
  @action
  updateRootDebounced(property: string, event: Event) {
    // @ts-ignore
    this.state[property] = (event.target as any).value;
    this.propagate({ debounced: true });
  }

  /**
   * For updating properties in the has-relation and has-attribute filter groups
   *
   * @param {string} property The property to update
   * @param {Event} event The input event that triggered the update
   */
  @action
  updateHas(property: string, event: Event) {
    let checked: boolean = (event.target as any).checked;
    if (checked) {
      this.state.has.add(property);
    } else {
      this.state.has.delete(property);
    }
    this.propagate({ debounced: false });
  }

  @action
  updateAdministrativeUnits(administrativeUnits: string[]) {
    this.state.administrativeUnit.selected = new Set(administrativeUnits);
    this.propagate({ debounced: false });
  }

  propagate({ debounced }: { debounced: boolean }) {
    if (debounced) {
      debounce(this, this.propagate_, 250);
    } else {
      this.propagate_();
    }
  }

  propagate_() {
    this.args.updateFilters(this.state);
  }

  // ----
  // Util
  // ----

  /**
   * Create array ["zitting", "handling", ...] from object {zitting: true, handling: true, ...}
   */
  objectToArray(object: { [key: string]: any }): string[] {
    return Object.entries(object)
      .filter(([_id, value]) => value)
      .map(([id, _value]) => id);
  }

  /**
   * Create object {zitting: true, handling: true, ...} from ["zitting", "handling"]
   */
  arrayToObject(array: string[]): { [key: string]: any } {
    return array.reduce(
      (acc: { [key: string]: boolean }, attributeId: string) => {
        acc[attributeId] = true;
        return acc;
      },
      {}
    );
  }
}
