
import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import DS from 'ember-data';
import BehandelingVanAgendapunt from './behandeling-van-agendapunt';

export default class Agendapunt extends Model {
  @attr('string') declare beschrijving: string;
  @attr('boolean') declare geplandOpenbaar: boolean;
  @attr('string') declare heeftOntwerpbesluit: string;
  @attr('string') declare titel: string;
  @attr('string') declare type: string;
  @attr('number') declare position: number;

  //TODO: publications
  @hasMany('agendapunt', { inverse: null }) declare referenties:
    DS.PromiseManyArray<Agendapunt>;
  @belongsTo('agendapunt', { inverse: null }) declare vorigeAgendapunt:
    DS.PromiseObject<Agendapunt>;
  @belongsTo('behandeling-van-agendapunt', { inverse: null }) declare behandeling:
    DS.PromiseObject<BehandelingVanAgendapunt>;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'agendapunt': Agendapunt;
  }
}
