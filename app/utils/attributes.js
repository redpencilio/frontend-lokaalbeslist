export const ENTITIES = {
  agendaPoint: {
    name: 'Agendapunt',
    nameShort: 'agendapunt',
    arity: 'single',
    rootAttribute: 'root',
  },
  zitting: {
    name: 'Zitting',
    nameShort: 'zitting',
    arity: 'single',
    rootAttribute: 'zittingURI',
  },
  handling: {
    name: 'Behandeling van Agendapunt',
    nameShort: 'behandeling',
    arity: 'single',
    rootAttribute: 'agendaItemHandlingURI',
  },
  draftResolution: {
    name: 'Ontwerpbesluit',
    nameShort: 'ontwerpbesluit',
    arity: 'multiple',
    rootAttribute: 'draftResolutionURIs',
  },
};

export const AGENDA_POINT_ATTRIBUTES = {
  // ------------------------
  // Rechtstreekse attributen
  // ------------------------
  uri: {
    entity: 'agendaPoint',
    count: true,
    description: 'link naar agendapunt',
    filter: { has: { name: 'link', displayAsAttribute: false } },
  },
  title: {
    entity: 'agendaPoint',
    count: true,
    description: 'titel',
    filter: { has: { name: 'titel' } },
  },
  description: {
    entity: 'agendaPoint',
    optional: true,
    count: false, // Optional field
    description: 'beschrijving',
    filter: { has: { name: 'beschrijving' } },
  },
  type: {
    entity: 'agendaPoint',
    count: true,
    description: 'type van het agendapunt',
    filter: { has: { name: 'type', displayAsAttribute: false } },
  },
  // typeURL: {
  //   entity: 'agendaPoint',
  //   count: false, // We don't want to count double with `type`
  // },
  plannedPublic: {
    entity: 'agendaPoint',
    count: true,
    description: 'gepland openbaar',
    filter: { has: { name: 'geplande openbaarheid' } },
  },
  // id: {
  //   entity: 'agendaPoint',
  //   count: false, // Duplicate of `uri`
  // },
  // uuid: {
  //   entity: 'agendaPoint',
  //   count: false, // This is always empty, and it is not important for end users anyway.
  // },
  references: {
    entity: 'agendaPoint',
    count: false, // Optional field
    optional: true,
    description: 'referenties aan andere agendapunten',
    filter: { has: { name: 'referenties' } },
  },

  // --------------------------------
  // Attributen via `draftResolution`
  // --------------------------------
  draftResolutionURIs: {
    entity: 'draftResolution',
    count: false, // Optional field
    optional: true,
    description: 'heeft ontwerpbesluit',
    filter: { has: { name: 'ontwerpbesluit', displayAsAttribute: false } },
  },

  // ------------------------
  // Attributen via `Zitting`
  // ------------------------
  zittingURI: {
    entity: 'zitting',
    count: true,
    description: 'link naar zitting',
    filter: { has: { name: 'link', displayAsAttribute: false } },
  },
  zittingPlannedStart: {
    entity: 'zitting',
    count: true,
    description: 'geplande start van de zitting',
    filter: { has: { name: 'geplande start' } },
  },
  zittingStartedAtTime: {
    entity: 'zitting',
    count: true,
    description: 'starttijd van de zitting',
    filter: { has: { name: 'starttijd' } },
  },
  zittingVerslagURI: {
    entity: 'zitting',
    count: false, // Optional field
    optional: true,
    description: 'link naar verslag van de zitting',
    filter: { has: { name: 'verslag' } },
  },
  zittingNotulenURI: {
    entity: 'zitting',
    count: false, // Optional field
    optional: true,
    description: 'link naar de notulen van de zitting',
    filter: { has: { name: 'notulen' } },
  },

  // We don't want to count both the URI's and the labels, and we don't display these URI's.
  // governingBodyURI: { entity: 'zitting', count: false },
  // governingBodyClassificationURI: { entity: 'zitting', count: false },
  // administrativeUnitURI: { entity: 'zitting', count: false },
  // administrativeUnitClassificationURI: { entity: 'zitting', count: false },

  // governingBody: {
  //   entity: 'zitting',
  //   count: false, // We don't display (and count) this, instead opting for `governingBodyClassification` + `administrativeUnit`.
  //   description: 'bestuursorgaan',
  // },
  governingBodyClassification: {
    entity: 'zitting',
    count: true,
    description: 'type bestuursorgaan',
    filter: { has: { name: 'type bestuursorgaan' } },
  },
  administrativeUnit: {
    entity: 'zitting',
    count: true,
    description: 'bestuurseenheid',
    filter: { has: { name: 'bestuurseenheid' } },
  },
  // administrativeUnitClassification: {
  //   entity: 'zitting',
  //   count: false, // We don't display (and count) this because it should always be 'Gemeente'.
  //   description: 'type bestuurseenheid',
  // },

  // -------------------------------------------
  // Attributen via `Behandeling van Agendapunt`
  // -------------------------------------------
  agendaItemHandlingURI: {
    entity: 'handling',
    count: true,
    description: 'link naar de behandeling van het agendapunt',
    filter: { has: { name: 'link', displayAsAttribute: false } },
  },
  agendaItemHandlingIsPublic: {
    entity: 'handling',
    count: true,
    description: 'openbaarheid van de behandeling van het agendapunt',
    filter: { has: { name: 'openbaarheid' } },
  },

  generatedResolutionURIs: {
    entity: 'handling',
    count: false, // Optional field
    optional: true,
    description: 'besluiten opgemaakt naar aanleiding van het agendapunt',
    filter: { has: { name: 'besluiten' } },
  },
  // generatedResolutionTitleShorts: { entity: 'handling', count: true, description: '' },
  // generatedResolutionDescriptions: { entity: 'handling', count: true, description: '' },
  // generatedResolutionMotivations: { entity: 'handling', count: true, description: '' },
  // generatedResolutionPublicationDates: { entity: 'handling', count: true, description: '' },
};
