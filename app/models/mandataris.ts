import Model, { belongsTo } from '@ember-data/model';
import DS from 'ember-data';
import Persoon from './persoon';

export default class Mandataris extends Model {
    @belongsTo('persoon', { inverse: null }) declare isBestuurlijkeAliasVan:
    DS.PromiseObject<Persoon>;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'mandataris': Mandataris;
  }
}
