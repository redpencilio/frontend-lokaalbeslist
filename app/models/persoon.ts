import Model, { attr } from '@ember-data/model';

export default class Persoon extends Model {
  @attr('string') declare gebruikteVoornaam: string;
  @attr('string') declare achternaam: string;
  @attr('string') declare alternatieveNaam: string;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'persoon': Persoon;
  }
}
