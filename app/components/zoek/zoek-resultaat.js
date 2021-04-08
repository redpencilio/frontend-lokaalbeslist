import Component from '@glimmer/component';

const AGENDA_POINT_ATTRIBUTES = [
  'uri',
  'administrativeUnit',
  'administrativeUnitClassification',
  'description',
  'governingBody',
  'governingBodyClassification',
  'title',
  'zittingPlannedStart',
  'zittingStartedAtTime',
  'zittingURI',

  // Ignore
  // ------
  // 'administrativeUnitURI',
  // 'administrativeUnitClassificationURI',
  // 'governingBodyURI',
  // 'governingBodyClassificationURI',

  // Ignore Other
  // ------------
  // 'id', (duplicate of uri)
  // 'uuid', (this is always empty, and it is not important for end users anyway)
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
