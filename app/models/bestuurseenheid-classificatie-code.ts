import Model, { attr } from '@ember-data/model';

export default class BestuurseenheidClassificatieCode extends Model {
  @attr() declare label: string;
  @attr() declare uri: string;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'bestuurseenheid-classificatie-code': BestuurseenheidClassificatieCode;
  }
}
