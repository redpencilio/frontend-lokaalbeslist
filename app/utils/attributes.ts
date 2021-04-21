/**
 * An entity is an object with it's own attributes.
 */
interface Entity {
  name: string;
  nameShort: string;
  arity: 'single' | 'multiple';

  /**
   * The attribute in {@see AGENDA_POINT_ATTRIBUTES} that points to the entity resource
   * (as opposed to one of it's attributes).
   */
  rootAttribute: 'root' | string;
}

/**
 * Entities present in the search result.
 */
export const ENTITIES: { [id: string]: Entity } = {
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

interface Attribute {
  /** The entity this attribute belongs to,with `agendaPoint` being the root one. */
  entity: string;

  /** A short description of the attribute */
  description: string;

  /** Properties related to counting and listing the missing attributes of the search result and it's entities */
  missing: {
    count: boolean;
    optional?: boolean;
  };

  /** Properties related to filtering the search result */
  filter: {
    /** Configuration of the has-attribute and has-relation filter fields */
    has: {
      /** A very short name used for e.g. the checkbox label */
      name: string;
      /** Wether this attribute should be listed as being filterable on */
      displayAsAttribute?: boolean;
    };
  };
}

/**
 * Attributes present in the search results and their corresponding configuration.
 *
 * Each field represents a field that is also present in the search result with
 * which we want to do something.
 */
export const AGENDA_POINT_ATTRIBUTES: { [id: string]: Attribute } = {
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
    filter: {
      has: {
        name: 'type',
        displayAsAttribute: false, // It's always empty currently
      },
    },
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
  // We don't care about these yet cause we should use a nested result here to make it comfortable.
  // generatedResolutionTitleShorts: { entity: 'handling', missing: { count: true, description: '' } },
  // generatedResolutionDescriptions: { entity: 'handling', missing: { count: true, description: '' } },
  // generatedResolutionMotivations: { entity: 'handling', missing: { count: true, description: '' } },
  // generatedResolutionPublicationDates: { entity: 'handling', missing: { count: true, description: '' } },
};
