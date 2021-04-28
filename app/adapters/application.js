import JSONAPIAdapter from '@ember-data/adapter/json-api';
import DS from 'ember-data';

export default class ApplicationAdapter extends DS.JSONAPIAdapter {
  // Prepend "/resource" to all Ember Data queries, as this is the endpoint
  // as configured in the dispatcher.
  namespace = 'resource';
}
