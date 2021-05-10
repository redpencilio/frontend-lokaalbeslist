import Route from '@ember/routing/route';

export default class InfoRoute extends Route {
  beforeModel() {
    this.replaceWith('info.for-users');
  }
}
