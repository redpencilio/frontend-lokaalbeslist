import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import DS from 'ember-data';

import BestuurseenheidClassificatieCode from './bestuurseenheid-classificatie-code';
import Bestuursorgaan from './bestuursorgaan';

export default class Bestuurseenheid extends Model {
  @attr('string') declare uri: string;

  @attr('string') declare naam: string;
  // @attr('string-set') alternatieveNaam: string[];

  // @belongsTo('werkingsgebied', { inverse: null }) werkingsgebied;
  // @belongsTo('werkingsgebied', { inverse: null }) provincie;

  @belongsTo('bestuurseenheid-classificatie-code', { inverse: null })
  declare classificatie: DS.PromiseObject<BestuurseenheidClassificatieCode>;

  @hasMany('bestuursorgaan', { inverse: null })
  declare bestuursorganen: DS.PromiseManyArray<Bestuursorgaan>;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'bestuurseenheid': Bestuurseenheid;
  }
}
