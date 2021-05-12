export interface ResourceConfig {
  config: AttributeConfig;
  attributes: { [key: string]: ResourceConfig | AttributeConfig };
}

export interface AttributeConfig {
  /** A short description of the attribute */
  description: string;

  /** Properties related to counting and listing the missing attributes of the search result and it's entities */
  missing?: {
    /**
     *  Wether the attribute should be listed as optional.
     *  Considered true by default, unless `display` is false or `optional` is true.
     */
    count?: boolean;

    /** Wether the attribute should be displayed in the list of attributes. Default is true. */
    display?: boolean;

    /** Wether the attribute should be listed as optional. Default is false. */
    optional?: boolean;
  };

  /** Properties related to filtering the search result */
  filter: {
    /** Configuration of the has-attribute and has-relation filter fields */
    has: {
      /** A very short name used for e.g. the checkbox label */
      name?: string;

      /** Wether this attribute should be listed as being filterable on */
      display?: boolean;
    };
  };

  /** Properties related to displaying match previews in this field */
  previews?: {
    /**
     * Wether the attribute should be displayed among the match previews.
     * Default is 'false'.
     * 'if-only-match' implies it should only be rendered if this field
     * only fields with this setting are matched.
     */
    display?: boolean | 'if-only-match';
  };
}

export function isResourceConfig(
  conf: ResourceConfig | AttributeConfig
): conf is ResourceConfig {
  return conf.hasOwnProperty('attributes');
}

/**
 * @param root An (nested) object of Attributes or Resources
 * @param depth The depth until which to recurse
 * @param prefix Prefix to at to the property path of each key
 * @returns A flattened list of attributes and their config, with keys like 'session.governingBody.label`.
 */
type AnnotatedConfig = { key: string; config: AttributeConfig };
export function iterate(
  root: { [key: string]: AttributeConfig | ResourceConfig },
  depth: number = -1,
  prefix: string = '',
  includeInner: boolean = false
): AnnotatedConfig[] {
  return Object.entries(root)
    .map(([key, config]) => {
      const path = prefix ? `${prefix}.${key}` : key;

      if (!isResourceConfig(config)) {
        return [{ key: path, config }];
      }

      const current = includeInner
        ? [{ key: path, config: config.config }]
        : [];

      const nested = depth ? iterate(config.attributes, depth - 1, path) : [];

      return current.concat(nested);
    })
    .flat();
}

/**
 * Attributes present in the search results ({@see SearchResult })
 * and their corresponding configuration for filtering and displaying.
 *
 * Each field represents a field that is also present in the search result with
 * which we want to do something.
 */
export const AGENDA_POINT_ATTRIBUTES: {
  attributes: { [key: string]: AttributeConfig | ResourceConfig };
} = {
  attributes: {
    // ------------------------
    // Rechtstreekse attributen
    // ------------------------
    uri: {
      description: 'link naar agendapunt',
      filter: { has: { display: false } },
    },
    id: {
      description: 'link naar het agendapunt',
      missing: { display: false }, // Duplicate of `uri`
      filter: { has: { display: false } },
    },
    uuid: {
      description: 'identificatienummer van het agendapunt',
      missing: {
        display: false,
      },
      filter: { has: { display: false } },
    },
    title: {
      description: 'titel',
      filter: { has: { name: 'titel' } },
    },
    description: {
      description: 'beschrijving',
      missing: { optional: true },
      filter: { has: { name: 'beschrijving' } },
    },
    type: {
      description: 'type van het agendapunt',
      missing: { display: false }, // It's always empty currently
      filter: {
        has: { display: false }, // It's always empty currently
      },
    },
    typeURL: {
      description: 'link naar type van het agendapunt',
      missing: { display: false }, // We don't want to count double with `type`
      filter: { has: { display: false } },
    },
    plannedPublic: {
      description: 'gepland openbaar',
      filter: { has: { name: 'geplande openbaarheid' } },
    },
    references: {
      description: 'referenties aan andere agendapunten',
      missing: { optional: true },
      previews: { display: 'if-only-match' },
      filter: { has: { name: 'referenties' } },
    },

    draftResolutionURIs: {
      description: 'ontwerpbesluit',
      missing: { optional: true },
      previews: { display: 'if-only-match' },
      filter: { has: { name: 'ontwerpbesluit', display: false } },
    },

    // ------------------------
    // Attributen via `Zitting`
    // ------------------------
    session: {
      config: {
        description: 'zitting',
        missing: { optional: true },
        filter: { has: { name: 'zitting', display: false } },
      },

      attributes: {
        uri: {
          description: 'link naar zitting',
          filter: { has: { display: false } },
        },
        uuid: {
          description: 'identificatienummer van de zitting',
          missing: { display: false },
          filter: { has: { display: false } },
        },
        plannedStart: {
          description: 'geplande start van de zitting',
          filter: { has: { name: 'geplande start' } },
        },
        startedAtTime: {
          description: 'starttijd van de zitting',
          filter: { has: { name: 'starttijd' } },
        },
        verslagURI: {
          description: 'link naar verslag van de zitting',
          missing: { optional: true },
          filter: { has: { name: 'verslag' } },
        },
        notulenURI: {
          description: 'link naar de notulen van de zitting',
          missing: { optional: true },
          filter: { has: { name: 'notulen' } },
        },

        governingBody: {
          config: {
            description: 'bestuursorgaan',
            filter: { has: { name: 'bestuursorgaan' } },
          },

          attributes: {
            label: {
              description: 'bestuursorgaan',
              missing: { count: true },
              filter: { has: { name: 'bestuursorgaan' } },
            },
            classification: {
              description: 'type bestuursorgaan',
              missing: { count: true },
              filter: { has: { name: 'type bestuursorgaan' } },
            },
            classificationURI: {
              description: 'TODO',
              missing: { count: false },
              filter: { has: { name: 'TODO' } },
            },
          },
        },
        administrativeUnit: {
          config: {
            description: 'bestuurseenheid',
            filter: { has: { name: 'bestuurseenheid' } },
          },

          attributes: {
            label: {
              description: 'bestuurseenheid',
              missing: { count: true },
              filter: { has: { name: 'bestuurseenheid' } },
            },
            classification: {
              description: 'type bestuurseenheid',
              missing: { count: false },
              filter: { has: { name: 'type bestuurseenheid' } },
            },
            classificationURI: {
              description: 'TODO',
              missing: { count: false },
              filter: { has: { name: 'TODO' } },
            },
          },
        },

        governanceArea: {
          config: {
            description: 'werkingsgebied',
            previews: { display: 'if-only-match' },
            filter: { has: { name: 'werkingsgebied' } },
          },
          attributes: {
            label: {
              description: 'werkingsgebied',
              missing: { count: true },
              previews: { display: 'if-only-match' },
              filter: { has: { name: 'werkingsgebied' } },
            },
          },
        },
      },
    },

    // -------------------------------------------
    // Attributen via `Behandeling van Agendapunt`
    // -------------------------------------------
    agendaItemHandling: {
      config: {
        description: 'behandeling van agendapunt',
        missing: { optional: true },
        filter: { has: { name: 'behandeling', display: false } },
      },

      attributes: {
        uri: {
          description: 'link naar de behandeling van het agendapunt',
          missing: { count: true },
          filter: { has: { name: 'link', display: false } },
        },
        isPublic: {
          description: 'openbaarheid van de behandeling van het agendapunt',
          missing: { count: true },
          filter: { has: { name: 'openbaarheid' } },
        },

        generatedResolutions: {
          config: {
            description: 'gegenereerde besluiten',
            missing: { count: false, optional: true },
            filter: { has: { name: 'besluiten' } },
          },

          attributes: {
            uri: {
              description:
                'besluiten opgemaakt naar aanleiding van het agendapunt',
              missing: { count: false, optional: true },
              filter: { has: { name: 'besluiten' } },
            },
            titleShort: {
              description: 'titel van het besluit',
              missing: { count: true },
              previews: { display: true },
              filter: { has: { name: 'TODO' } },
            },
            description: {
              description: 'beschrijving van het besluit',
              missing: { count: true },
              previews: { display: true },
              filter: { has: { name: 'TODO' } },
            },
            motivation: {
              description: 'motivatie van het besluit',
              missing: { count: true },
              previews: { display: true },
              filter: { has: { name: 'TODO' } },
            },
            publicationDate: {
              description: 'publicatie-datum van het besluit',
              missing: { count: true },
              filter: { has: { name: 'TODO' } },
            },
          },
        },
      },
    },
  },
};
