import Application from '@ember/application';
import Inflector from 'ember-inflector';

export function initialize(_application: Application): void {
  const inflector = Inflector.inflector;

  // Apparently, order matters here as pluralize('behandeling-van-agendapunt')
  // matches 'agendapunt' and 'behandeling-van-agendapunt'
  inflector.irregular('behandeling-van-agendapunt', 'behandelingen-van-agendapunten');
  inflector.irregular('agendapunt', 'agendapunten');
  inflector.irregular('zitting', 'zittingen');
  inflector.irregular('persoon', 'personen');
  inflector.irregular('mandataris', 'mandatarissen');
  inflector.irregular('bestuursorgaan', 'bestuursorganen');
  inflector.irregular('bestuurseenheid', 'bestuurseenheden');
  inflector.irregular('werkingsgebied', 'werkingsgebieden');
}

export default {
  initialize,
};
