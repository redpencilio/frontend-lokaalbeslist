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
    description: 'link naar agendapunt',
    missing: { count: true },
    filter: { has: { name: 'link', displayAsAttribute: false } },
  },
  title: {
    entity: 'agendaPoint',
    description: 'titel',
    missing: { count: true },
    filter: { has: { name: 'titel' } },
  },
  description: {
    entity: 'agendaPoint',
    description: 'beschrijving',
    missing: { count: false, optional: true },
    filter: { has: { name: 'beschrijving' } },
  },
  type: {
    entity: 'agendaPoint',
    description: 'type van het agendapunt',
    missing: { count: true },
    filter: { has: { name: 'type', displayAsAttribute: false } },
  },
  // typeURL: {
  //   entity: 'agendaPoint',
  //   missing: { count: false }, // We don't want to count double with `type`
  // },
  plannedPublic: {
    entity: 'agendaPoint',
    description: 'gepland openbaar',
    missing: { count: true },
    filter: { has: { name: 'geplande openbaarheid' } },
  },
  // id: {
  //   entity: 'agendaPoint',
  //   missing: { count: false }, // Duplicate of `uri`
  // },
  // uuid: {
  //   entity: 'agendaPoint',
  //   missing: { count: false, // This is always empty }, and it is not important for end users anyway.
  // },
  references: {
    entity: 'agendaPoint',
    description: 'referenties aan andere agendapunten',
    missing: { optional: true, count: false },
    filter: { has: { name: 'referenties' } },
  },

  // --------------------------------
  // Attributen via `draftResolution`
  // --------------------------------
  draftResolutionURIs: {
    entity: 'draftResolution',
    description: 'heeft ontwerpbesluit',
    missing: { count: false, optional: true },
    filter: { has: { name: 'ontwerpbesluit', displayAsAttribute: false } },
  },

  // ------------------------
  // Attributen via `Zitting`
  // ------------------------
  zittingURI: {
    entity: 'zitting',
    description: 'link naar zitting',
    missing: { count: true },
    filter: { has: { name: 'link', displayAsAttribute: false } },
  },
  zittingPlannedStart: {
    entity: 'zitting',
    description: 'geplande start van de zitting',
    missing: { count: true },
    filter: { has: { name: 'geplande start' } },
  },
  zittingStartedAtTime: {
    entity: 'zitting',
    description: 'starttijd van de zitting',
    missing: { count: true },
    filter: { has: { name: 'starttijd' } },
  },
  zittingVerslagURI: {
    entity: 'zitting',
    description: 'link naar verslag van de zitting',
    missing: { count: false, optional: true }, // Optional field
    filter: { has: { name: 'verslag' } },
  },
  zittingNotulenURI: {
    entity: 'zitting',
    description: 'link naar de notulen van de zitting',
    missing: { count: false, optional: true },
    filter: { has: { name: 'notulen' } },
  },

  // We don't want to count both the URI's and the labels, and we don't display these URI's.
  // governingBodyURI: { entity: 'zitting', missing: { count: false } },
  // governingBodyClassificationURI: { entity: 'zitting', missing: { count: false } },
  // administrativeUnitURI: { entity: 'zitting', missing: { count: false } },
  // administrativeUnitClassificationURI: { entity: 'zitting', missing: { count: false } },

  // governingBody: {
  //   entity: 'zitting',
  //   missing: { count: false, // We don't display (and count) this , instead opting for `governingBodyClassification` + `administrativeUnit`.
  //   description: 'bestuursorgaan',
  // },
  governingBodyClassification: {
    entity: 'zitting',
    description: 'type bestuursorgaan',
    missing: { count: true },
    filter: { has: { name: 'type bestuursorgaan' } },
  },
  administrativeUnit: {
    entity: 'zitting',
    description: 'bestuurseenheid',
    missing: { count: true },
    filter: { has: { name: 'bestuurseenheid' } },
  },
  // administrativeUnitClassification: {
  //   entity: 'zitting',
  //   missing: { count: false }, // We don't display (and count) this because it should always be 'Gemeente'.
  //   description: 'type bestuurseenheid',
  // },

  // -------------------------------------------
  // Attributen via `Behandeling van Agendapunt`
  // -------------------------------------------
  agendaItemHandlingURI: {
    entity: 'handling',
    description: 'link naar de behandeling van het agendapunt',
    missing: { count: true },
    filter: { has: { name: 'link', displayAsAttribute: false } },
  },
  agendaItemHandlingIsPublic: {
    entity: 'handling',
    description: 'openbaarheid van de behandeling van het agendapunt',
    missing: { count: true },
    filter: { has: { name: 'openbaarheid' } },
  },

  generatedResolutionURIs: {
    entity: 'handling',
    description: 'besluiten opgemaakt naar aanleiding van het agendapunt',
    missing: { count: false, optional: true },
    filter: { has: { name: 'besluiten' } },
  },
  // generatedResolutionTitleShorts: { entity: 'handling', missing: { count: true, description: '' } },
  // generatedResolutionDescriptions: { entity: 'handling', missing: { count: true, description: '' } },
  // generatedResolutionMotivations: { entity: 'handling', missing: { count: true, description: '' } },
  // generatedResolutionPublicationDates: { entity: 'handling', missing: { count: true, description: '' } },
};
