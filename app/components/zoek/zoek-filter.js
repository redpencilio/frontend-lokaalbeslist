import { AGENDA_POINT_ATTRIBUTES, ENTITIES } from '../../utils/attributes';

import Component from '@glimmer/component';
import { action } from '@ember/object';
import { debounce } from '@ember/runloop';

import cloneDeep from 'lodash.clonedeep';
import merge from 'lodash.merge';

const CHANGED_INITIAL = { has: {} };

export default class ZoekZoekFilterComponent extends Component {
  get AGENDA_POINT_ATTRIBUTES() {
    return AGENDA_POINT_ATTRIBUTES;
  }

  get ENTITIES() {
    return ENTITIES;
  }

  changed = cloneDeep(CHANGED_INITIAL);

  /**
   * For updating **root** properties in a debounced manner.
   *
   * @param {string} property The property to update
   * @param {*} event The input event that triggered the update
   */
  @action
  updatePropertyDebounced(property, event) {
    this.changed[property] = event.target.value;
    this.propagate({ debounced: true });
  }

  /**
   * For updating properties in the has-relation and has-attribute filter groups
   *
   * @param {string} property The property to update
   * @param {Event} event The input event that triggered the update
   */
  @action
  updatePropertyHas(property, event) {
    this.changed.has[property] = event.target.checked;
    this.propagate({ debounce: false });
  }

  propagate({ debounced }) {
    if (debounced) {
      debounce(this, this.propagateStateUp, 250);
    } else {
      this.propagateStateUp();
    }
  }

  propagateStateUp() {
    const filters = merge(cloneDeep(this.args.fields), this.changed);
    this.changed = cloneDeep(CHANGED_INITIAL);
    this.args.updateFilters(filters);
  }
}
