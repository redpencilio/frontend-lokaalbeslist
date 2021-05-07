import Application from '@ember/application';
import Inflector from 'ember-inflector';

export function initialize(_application: Application): void {
  const inflector = Inflector.inflector;

  inflector.irregular('bestuursorgaan', 'bestuursorganen');
  inflector.irregular('bestuurseenheid', 'bestuurseenheden');
  inflector.irregular('werkingsgebied', 'werkingsgebieden');
}

export default {
  initialize,
};
