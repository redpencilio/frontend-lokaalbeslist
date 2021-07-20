import Component from '@glimmer/component';
import { action } from '@ember/object';

interface SortButtonComponentArgs {
  onSelected: (event: string) => void,
}

/**
 * @param {object} options
 * @param {string} currentlySelected
 * @param {fn} onSelected
 */
export default class SortButtonComponent extends Component<SortButtonComponentArgs> {
  @action
  select(event: Event) {
    this.args.onSelected((event.target as HTMLSelectElement)?.value);
  }
}
