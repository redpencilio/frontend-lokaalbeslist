import Component from '@glimmer/component';
import { action } from '@ember/object';

interface Args {
  onResetFilters(): void;
}

export default class ZoekFilterControlBar extends Component<Args> {
  @action
  onResetFilters() {
    this.args.onResetFilters();
  }

  @action
  onSaveFilters() {
    // TODO
    alert(
      'Dit is nog niet geïmplementeerd. U kan momenteel deze pagina toevoegen aan uw bladwijzers om deze filters te bewaren.'
    );
  }
}
