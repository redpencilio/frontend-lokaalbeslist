import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import RouterService from '@ember/routing/router-service';

// @ts-ignore
import hljs from 'highlight.js/lib/core';

enum Frequency {
  Dagelijks = 'dagelijks',
  Wekelijks = 'wekelijks',
  Maandelijks = 'maandelijks',
}

export default class SubscribeController extends Controller {
  @service declare store: Store;
  @service declare router: RouterService;

  queryParams = ['search', 'governanceAreas'];

  @tracked
  search: string = "";

  @tracked
  governanceAreas: string[] = [];

  @tracked
  frequency: Frequency = Frequency.Wekelijks;

  constructor() {
    super();
  }

  get frequencies() {
    return Object.keys(Frequency).filter((x) => isNaN(Number(x)));
  }

  @action
  changeFrequency(value: Frequency): void {
    this.frequency = value;
  }

  @action
  updateEmail(event: Event) {
    this.model.email = (event.target as HTMLInputElement).value;
  }
}
