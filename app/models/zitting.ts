import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import DS from 'ember-data';
import Agendapunt from './agendapunt';
import Bestuursorgaan from './bestuursorgaan';
import Mandataris from './mandataris';

export default class Zitting extends Model {
    @attr('date') declare geplandeStart: Date;
    @attr('date') declare gestartOpTijdstip: Date;
    @attr('date') declare geeindigdOpTijdstip: Date;
    @attr('string') declare opLocatie: string;

    @hasMany('agendapunt', { inverse: null }) declare agendapunten:
    DS.PromiseArray<Agendapunt>;
    @hasMany('mandataris', { inverse: null }) declare aanwezigenBijStart:
    DS.PromiseArray<Mandataris>;
    @belongsTo('bestuursorgaan', { inverse: null }) declare bestuursorgaan:
    DS.PromiseObject<Bestuursorgaan>;
    @belongsTo('mandataris', { inverse: null }) declare secretaris:
    DS.PromiseObject<Mandataris>;
    @belongsTo('mandataris', { inverse: null }) declare voorzitter:
    DS.PromiseObject<Mandataris>;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'zitting': Zitting;
  }
}
