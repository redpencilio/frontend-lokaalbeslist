import Route from '@ember/routing/route';

export default class IndexRoute extends Route {
  beforeModel(/* transition */) {
    this.transitionTo('search'); // Implicitly aborts the on-going transition.
  }
}
