export interface SearchResult {
  // ------------------------
  // Rechtstreekse attributen
  // ------------------------
  uri: string;
  title: null | string | string[];
  description: null | null | string | string[];
  type: null | string | string[];
  typeURL: null | string | string[];
  plannedPublic: null | boolean | boolean[];
  id: string;
  uuid: null | string | string[];
  references: null | string | string[];

  // --------------------------------
  // Attributen via `draftResolution`
  // --------------------------------
  draftResolutionURIs: null | string | string[];

  // ------------------------
  // Attributen via `Zitting`
  // ------------------------
  zittingURI: null | string | string[];
  zittingPlannedStart: null | string | string[];
  zittingStartedAtTime: null | string | string[];
  zittingVerslagURI: null | string | string[];
  zittingNotulenURI: null | string | string[];

  governingBodyClassificationURI: null | string | string[];
  administrativeUnitURI: null | string | string[];
  administrativeUnitClassificationURI: null | string | string[];

  governingBody: null | string | string[];
  governingBodyClassification: null | string | string[];
  administrativeUnit: null | string | string[];
  administrativeUnitClassification: null | string | string[];

  // -------------------------------------------
  // Attributen via `Behandeling van Agendapunt`
  // -------------------------------------------
  agendaItemHandlingURI: null | string | string[];
  agendaItemHandlingIsPublic: null | boolean | boolean[];

  generatedResolutionURIs: null | string | string[];
  generatedResolutionTitleShorts: null | string | string[];
  generatedResolutionDescriptions: null | string | string[];
  generatedResolutionMotivations: null | string | string[];
  generatedResolutionPublicationDates: null | string | string[];
}
