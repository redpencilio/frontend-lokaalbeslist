import EmberRouter from '@ember/routing/router';
import config from 'frontend-lokaalbeslist/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('search', { path: '/zoek' });
  this.route('search-embedded', { path: '/embed/zoek/:embedded/' });
  this.route('subscribe', { path: '/subscribe' });
  this.route('subscription-succesful', { path: '/subscription-succesful' });
  this.route('subscriptions', { path: '/subscriptions' });
  this.route('agendapunt', { path: '/agendapunt/:agendapunt_id' });
  this.route('zitting', { path: '/zitting/:zitting_id' });
  this.route('info', function () {
    this.route('for-users', { path: 'voor-gebruikers' });
    this.route('for-municipalities', { path: 'voor-gemeentes' });
  });
});
