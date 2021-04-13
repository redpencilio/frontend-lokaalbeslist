export const AGENDA_POINT_ATTRIBUTES = {
  // ------------------------
  // Rechtstreekse attributen
  // ------------------------
  uri: {
    entity: 'agendaPoint',
    count: true,
    description: 'link naar agendapunt',
  },
  title: {
    entity: 'agendaPoint',
    count: true,
    description: 'titel',
  },
  description: {
    entity: 'agendaPoint',
    optional: true,
    count: false, // Optional field
    description: 'beschrijving',
  },
  type: {
    entity: 'agendaPoint',
    count: true,
    description: 'type van het agendapunt',
  },
  typeURL: {
    entity: 'agendaPoint',
    count: false, // We don't want to count double with `type`
  },
  plannedPublic: {
    entity: 'agendaPoint',
    count: true,
    description: 'gepland openbaar',
  },
  id: {
    entity: 'agendaPoint',
    count: false, // Duplicate of `uri`
  },
  uuid: {
    entity: 'agendaPoint',
    count: false, // This is always empty, and it is not important for end users anyway.
  },
  references: {
    entity: 'agendaPoint',
    count: false, // Optional field
    optional: true,
    description: 'referenties aan andere agendapunten',
  },
  draftResolutionURIs: {
    entity: 'agendaPoint',
    count: false, // Optional field
    optional: true,
    description: 'heeft ontwerpbesluit',
  },

  // ------------------------
  // Attributen via `Zitting`
  // ------------------------
  zittingURI: {
    entity: 'zitting',
    count: true,
    description: 'link naar zitting',
  },
  zittingPlannedStart: {
    entity: 'zitting',
    count: true,
    description: 'geplande start van de zitting',
  },
  zittingStartedAtTime: {
    entity: 'zitting',
    count: true,
    description: 'starttijd van de zitting',
  },
  zittingVerslagURI: {
    entity: 'zitting',
    count: false, // Optional field
    optional: true,
    description: 'link naar verslag van de zitting',
  },
  zittingNotulenURI: {
    entity: 'zitting',
    count: false, // Optional field
    optional: true,
    description: 'link naar de notulen van de zitting',
  },

  // We don't want to count both the URI's and the labels, and we don't display these URI's.
  governingBodyURI: { entity: 'zitting', count: false },
  governingBodyClassificationURI: { entity: 'zitting', count: false },
  administrativeUnitURI: { entity: 'zitting', count: false },
  administrativeUnitClassificationURI: { entity: 'zitting', count: false },

  governingBody: {
    entity: 'zitting',
    count: false, // We don't display (and count) this, instead opting for `governingBodyClassification` + `administrativeUnit`.
    description: 'bestuursorgaan',
  },
  governingBodyClassification: {
    entity: 'zitting',
    count: true,
    description: 'type bestuursorgaan',
  },
  administrativeUnit: {
    entity: 'zitting',
    count: true,
    description: 'bestuurseenheid',
  },
  administrativeUnitClassification: {
    entity: 'zitting',
    count: false, // We don't display (and count) this because it should always be 'Gemeente'.
    description: 'type bestuurseenheid',
  },

  // -------------------------------------------
  // Attributen via `Behandeling van Agendapunt`
  // -------------------------------------------
  agendaItemHandlingURI: {
    entity: 'handling',
    count: true,
    description: 'link naar de behandeling van het agendapunt',
  },
  agendaItemHandlingIsPublic: {
    entity: 'handling',
    count: true,
    description: 'openbaarheid van de behandeling van het agendapunt',
  },

  generatedResolutionURIs: {
    entity: 'handling',
    count: false, // Optional field
    description: 'opgemaakte besluiten naar aanleiding van het agendapunt',
  },
  // generatedResolutionTitleShorts: { entity: 'handling', count: true, description: '' },
  // generatedResolutionDescriptions: { entity: 'handling', count: true, description: '' },
  // generatedResolutionMotivations: { entity: 'handling', count: true, description: '' },
  // generatedResolutionPublicationDates: { entity: 'handling', count: true, description: '' },
};
