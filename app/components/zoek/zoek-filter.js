import Component from '@glimmer/component';
import { action } from '@ember/object';
import { debounce } from '@ember/runloop';

/**
 * @param {fn} updateFilters
 */
export default class ZoekZoekFilterComponent extends Component {
  changed = {};

  @action
  updatePropertyDebounced(property, event) {
    this.updateAndPropagate(property, event.target.value, true);
  }

  @action
  updatePropertyChecked(property, event) {
    this.updateAndPropagate(property, event.target.checked);
  }

  updateAndPropagate(property, value, debounced) {
    this.changed[property] = value;
    if (debounced) {
      debounce(this, this.propagateStateUp, 250);
    } else {
      this.propagateStateUp();
    }
  }

  propagateStateUp() {
    const filters = { ...this.args.fields, ...this.changed };
    this.changed = {};
    this.args.updateFilters(filters);
  }
}
