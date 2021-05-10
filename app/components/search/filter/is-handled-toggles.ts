import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

interface Args {
  currentState: 'no' | 'yes' | undefined;
  update(
    value: 'no' | 'yes' | undefined,
    config?: { debounced: boolean }
  ): void;
}

export default class SearchFilterIsHandledToggles extends Component<Args> {
  @tracked
  state = this.args.currentState;

  get isHandled() {
    return this.state === 'yes';
  }

  get isNotHandled() {
    return this.state === 'no';
  }

  @action
  toggleHandled(value: boolean) {
    this.state = value ? 'yes' : undefined;
    this.args.update(this.state, { debounced: true });
  }

  @action
  toggleNotHandled(value: boolean) {
    this.state = value ? 'no' : undefined;
    this.args.update(this.state, { debounced: true });
  }
}
