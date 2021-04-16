import Component from '@glimmer/component';
import { action } from '@ember/object';

/**
 * @param {object} options
 * @param {string} currentlySelected
 * @param {fn} onSelected
 */
export default class SortButtonComponent extends Component {
  @action
  select(event) {
    this.args.onSelected(event.target.value);
  }
}
