import EmberRouter from '@ember/routing/router';
import config from 'frontend-poc-participatie/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('search', { path: '/zoek' });
  this.route('search-embedded', { path: '/embed/zoek/:embedded/' });
  this.route('info');
});
