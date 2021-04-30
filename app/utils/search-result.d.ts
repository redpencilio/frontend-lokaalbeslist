export interface SearchResult {
  // ------------------------
  // Rechtstreekse attributen
  // ------------------------
  uri: string;
  id: string;
  uuid: null | string;
  title: null | string | string[];
  description: null | null | string | string[];
  type: null | string | string[];
  typeURL: null | string | string[];
  plannedPublic: null | boolean | boolean[];
  references: null | string | string[];

  // --------------------------------
  // Attributen via `draftResolution`
  // --------------------------------
  draftResolutionURIs: null | string | string[];

  // ------------------------
  // Attributen via `Zitting`
  // ------------------------
  zitting: {
    uri: string;
    uuid: null | string;
    plannedStart: null | string | string[];
    startedAtTime: null | string | string[];
    verslagURI: null | string | string[];
    notulenURI: null | string | string[];

    governingBody: {
      uri: string;
      uuid: null | string;
      label: null | string | string[];
      classification: null | string | string[];
      classificationURI: null | string | string[];
    };

    administrativeUnit: {
      uri: string;
      uuid: null | string;
      label: null | string | string[];
      classification: null | string | string[];
      classificationURI: null | string | string[];
    };
  };

  // -------------------------------------------
  // Attributen via `Behandeling van Agendapunt`
  // -------------------------------------------
  agendaItemHandling: {
    uri: string;
    uuid: null | string;
    isPublic: null | boolean | boolean[];

    generatedResolutions: {
      uri: string;
      uuid: null | string;
      titleShort: null | string | string[];
      description: null | string | string[];
      motivation: null | string | string[];
      publicationDate: null | string | string[];
    };
  };
}
