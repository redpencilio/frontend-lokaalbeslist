import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';

export default class NavbarComponent extends Component {
  @tracked
  burgerActive = false;

  @action
  toggleBurger() {
    this.burgerActive = !this.burgerActive;
  }
}
