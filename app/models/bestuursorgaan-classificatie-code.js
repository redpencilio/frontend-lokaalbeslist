import Model, { attr } from '@ember-data/model';

export default class BestuursorgaanClassificatieCode extends Model {
  @attr() uri;
  @attr() label;
}
