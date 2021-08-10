import Controller from "@ember/controller";

export default class SubscriptionsController extends Controller {
  queryParams = ['token'];

  token = null;
}
