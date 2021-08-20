
import Model, { attr } from '@ember-data/model';

export default class BehandelingVanAgendapunt extends Model {
    @attr('boolean') declare openbaar: boolean;
    @attr('string') declare gevolg: string;
    @attr('string') declare afgeleidUit: string;
    @attr('number') declare position: number;

    // TODO: relations
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'behandeling-van-agendapunt': BehandelingVanAgendapunt;
  }
}
