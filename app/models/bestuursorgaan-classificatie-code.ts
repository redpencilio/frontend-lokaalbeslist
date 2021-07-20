import Model, { attr } from '@ember-data/model';

export default class BestuursorgaanClassificatieCode extends Model {
  @attr('string') declare uri: string;
  @attr('string') declare label: string;
}
