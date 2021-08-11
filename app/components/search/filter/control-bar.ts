import Component from '@glimmer/component';
import { action } from '@ember/object';

interface Args {
  onResetFilters(): void;
  onSaveFilters(): void;
}

export default class SearchFilterControlBar extends Component<Args> {
  @action
  onResetFilters() {
    this.args.onResetFilters();
  }

  @action
  onSaveFilters() {
    this.args.onSaveFilters();
  }
}
