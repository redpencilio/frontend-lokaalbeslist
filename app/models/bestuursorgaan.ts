import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import DS from 'ember-data';
import Bestuurseenheid from 'frontend-lokaalbeslist/models/bestuurseenheid';
import BestuursorgaanClassificatieCode from 'frontend-lokaalbeslist/models/bestuursorgaan-classificatie-code';

export default class Bestuursorgaan extends Model {
  @attr('string') declare uri: string;
  @attr('string') declare naam: string;
  @attr('date') declare bindingStart: Date;
  @attr('date') declare bindingEinde: Date;

  @belongsTo('bestuurseenheid', { inverse: null }) declare bestuurseenheid: DS.PromiseObject<Bestuurseenheid>;
  @belongsTo('bestuursorgaan-classificatie-code', { inverse: null }) declare classificatie: DS.PromiseObject<BestuursorgaanClassificatieCode>;
  @belongsTo('bestuursorgaan', { inverse: null }) declare isTijdsspecialisatieVan: DS.PromiseObject<Bestuursorgaan>;
  @hasMany('bestuursorgaan', { inverse: null }) declare heeftTijdsspecialisaties: DS.PromiseObject<Bestuursorgaan>;
}
