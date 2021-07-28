import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'frontend-lokaalbeslist/config/environment';

import hljs from 'highlight.js/lib/core';
import xml from "highlight.js/lib/languages/xml";
hljs.registerLanguage('xml', xml);

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
