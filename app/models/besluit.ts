import Model, { attr, belongsTo } from '@ember-data/model';
import DS from 'ember-data';
import { Motivering } from 'frontend-lokaalbeslist/transforms/motivering';
import Mandataris from './mandataris';

export default class Besluit extends Model {
    @attr('string') declare beschrijving: string;
    @attr('motivering') declare motivering: Motivering;

    @belongsTo('behandeling-van-agendapunt', { inverse: 'besluiten' }) declare volgendUitBehandelingVanAgendapunt: DS.PromiseObject<Mandataris>;

}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'besluit': Besluit;
  }
}
