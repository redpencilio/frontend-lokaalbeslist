import Component from '@glimmer/component';

const AGENDA_POINT_ATTRIBUTES = [
  'uri',
  'administrativeUnit',
  'administrativeUnitClassification',
  'administrativeUnitClassificationURI',
  'administrativeUnitURI',
  'description',
  'governingBody',
  'governingBodyClassification',
  'governingBodyClassificationURI',
  'governingBodyURI',
  'id',
  'title',
  'uri',
  'uuid',
  'zittingPlannedStart',
  'zittingStartedAtTime',
  'zittingURI',
];

export default class ZoekZoekResultaatComponent extends Component {
  get numberOfEmptyProperties() {
    // Keep all properties that are null or undefined and then count by using `.length`
    return AGENDA_POINT_ATTRIBUTES.filter(
      (prop) =>
        this.args.result[prop] === null || this.args.result[prop] === undefined
    ).length;
  }
}
