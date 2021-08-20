import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import DS from 'ember-data';

import BestuurseenheidClassificatieCode from './bestuurseenheid-classificatie-code';
import Bestuursorgaan from './bestuursorgaan';
import Werkingsgebied from './werkingsgebied';

export default class Bestuurseenheid extends Model {
  @attr('string') declare uri: string;

  @attr('string') declare naam: string;
  // @attr('string-set') alternatieveNaam: string[];

  @belongsTo('werkingsgebied', { inverse: null }) declare werkingsgebied:
  DS.PromiseObject<Werkingsgebied>;
  @belongsTo('werkingsgebied', { inverse: null }) declare provincie:
  DS.PromiseObject<Werkingsgebied>;

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
