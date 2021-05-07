import Model, { attr, hasMany } from '@ember-data/model';
import DS from 'ember-data';

import Bestuursorgaan from './bestuursorgaan';

export default class Werkingsgebied extends Model {
  @attr() declare uri: string;

  @attr() declare naam: string;

  @hasMany('bestuurseenheden', { inverse: null })
  declare bestuureenheden: DS.PromiseManyArray<Bestuursorgaan>;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    werkingsgebied: Werkingsgebied;
  }
}
