import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import RouterService from '@ember/routing/router-service';

import { FilterFormErrors } from 'frontend-lokaalbeslist/components/subscription-filter/filter';

export default class SubscribeController extends Controller {
  @service declare store: Store;
  @service declare router: RouterService;

  queryParams = ['search', 'governanceAreas'];

  @tracked
  search: string = "";

  @tracked
  governanceAreas: string[] = [];

  @tracked
  errors: FilterFormErrors | undefined;

  constructor() {
    super();
  }

  @action
  updateEmail(event: Event) {
    this.model.email = (event.target as HTMLInputElement).value;
  }

  @action
  setErrors(errors: FilterFormErrors) {
    this.errors = errors;
  }

}
