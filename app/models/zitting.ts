import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import DS from 'ember-data';
import Agendapunt from './agendapunt';
import Bestuursorgaan from './bestuursorgaan';

export default class Zitting extends Model {
    @attr('date') declare geplandeStart: Date;
    @attr('date') declare gestartOpTijdstip: Date;
    @attr('date') declare geeindigdOpTijdstip: Date;
    @attr('string') declare opLocatie: string;

    @hasMany('agendapunt', { inverse: null }) declare agendapunten:
    DS.PromiseArray<Agendapunt>;
    @belongsTo('bestuursorgaan', { inverse: null }) declare bestuursorgaan:
    DS.PromiseObject<Bestuursorgaan>;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'zitting': Zitting;
  }
}
