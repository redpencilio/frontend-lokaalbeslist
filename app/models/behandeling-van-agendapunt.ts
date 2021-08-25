import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import DS from 'ember-data';
import Besluit from './besluit';
import Mandataris from './mandataris';

export default class BehandelingVanAgendapunt extends Model {
    @attr('boolean') declare openbaar: boolean;
    @attr('string') declare gevolg: string;
    @attr('string') declare afgeleidUit: string;
    @attr('number') declare position: number;

    @hasMany('mandataris', { inverse: null }) declare aanwezigen: DS.PromiseArray<Mandataris>;
    @hasMany('besluit', { inverse: 'volgendUitBehandelingVanAgendapunt' }) declare besluiten:
    DS.PromiseArray<Besluit>;
    @belongsTo('mandataris', { inverse: null }) declare voorzitter: DS.PromiseObject<Mandataris>;
    @belongsTo('mandataris', { inverse: null }) declare secretaris: DS.PromiseObject<Mandataris>;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'behandeling-van-agendapunt': BehandelingVanAgendapunt;
  }
}
