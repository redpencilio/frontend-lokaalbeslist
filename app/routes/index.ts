import Route from '@ember/routing/route';
import Controller from '../controllers/index';

export default class IndexRoute extends Route {
  setupController(controller: Controller, model: any, transition: any) {
    super.setupController(controller, model, transition);
    controller.startCounter();
  }

  deactivate() {
    const controller: Controller = this.controller;
    controller.resetCounter();
  }
}
