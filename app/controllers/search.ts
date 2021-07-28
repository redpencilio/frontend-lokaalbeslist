import Controller from '@ember/controller';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

import { QueryStateManager } from 'frontend-lokaalbeslist/utils/query-state';

export default class SearchController extends Controller {
  @service declare router: RouterService;

  // QueryStateManager, see setupController in Search Route.
  // Most of it's state properties are tracked and trigger re-renders here.
  declare qsm: QueryStateManager;
}
