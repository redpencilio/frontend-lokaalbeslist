import {
  AGENDA_POINT_ATTRIBUTES,
  ENTITIES,
  isResourceConfig,
  ResourceConfig,
} from '../../../utils/attributes';

import Component from '@glimmer/component';
import { SearchResult } from 'frontend-poc-participatie/utils/search-result';

interface Args {
  /** The search result (with all attributes) */
  result: SearchResult;

  /** The entity of which the attributes should be considered. */
  entity: string;

  /** Entity name that will be displayed in case of nested entities. */
  entityName: string | undefined;
}

interface Attribute {
  isMissing: boolean;
  count: boolean | undefined;
  display: boolean;
  optional: boolean;
  description: string;
}

/**
 * A tag component highlighting how many (if any) missing attributes there are.
 * Does icon selection and icon coloring depending on the results as well.
 *
 * @see {@link AGENDA_POINT_ATTRIBUTES} and {@link SearchResult} for the data this component acts on.
 */
export default class ZoekResultaatAttributeTagComponent extends Component<Args> {
  get ENTITIES() {
    return ENTITIES;
  }

  get AGENDA_POINT_ATTRIBUTES() {
    return AGENDA_POINT_ATTRIBUTES;
  }

  get numberOfAttrsMissing() {
    // Get the MISSING attributes (that we should count)
    const missing = this.attributes.filter(
      ({ isMissing, count, display, optional }) => {
        // Only count if it should be displayed and is not optional
        let shouldCount = count === undefined ? display && !optional : count;
        return shouldCount && isMissing; // Take inverse because
      }
    );
    return missing.length;
  }

  get attributes(): Attribute[] {
    const resource = this.resource;

    const configs = this.args.entity
      ? (AGENDA_POINT_ATTRIBUTES.attributes[
          this.args.entity as keyof typeof AGENDA_POINT_ATTRIBUTES.attributes
        ] as ResourceConfig).attributes
      : AGENDA_POINT_ATTRIBUTES.attributes;

    return Object.entries(configs).map(([key, config_]) => {
      const config = isResourceConfig(config_) ? config_.config : config_;

      // Add wether it is present in the result
      const isMissing = resource
        ? resource[key] === null || resource[key] === undefined
        : true;

      return {
        isMissing,
        description: config.description,

        // Set default values for easier rendering code
        count: config.missing?.count,
        display: config.missing?.display ?? true,
        optional: config.missing?.optional ?? false,
      };
    });
  }

  get resource(): any | undefined {
    return this.args.entity
      ? this.args.result[this.args.entity as keyof SearchResult]
      : this.args.result;
  }

  get isNested() {
    return !!this.args.entity;
  }

  get isNestedPresent() {
    return !!this.resource;
  }

  // Visuals (move branch spaghetti here instead of in template)
  // -------

  get shouldDisplayEntityName() {
    return this.isNested;
  }

  get displayNumberOfMissingAttrs() {
    if (this.isNested) {
      if (this.isNestedPresent) {
        return this.numberOfAttrsMissing !== 0;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  get icon() {
    if (this.isNested) {
      if (this.isNestedPresent) {
        return 'check';
      } else {
        return 'alert-circle';
      }
    } else {
      if (this.numberOfAttrsMissing > 0) {
        return 'alert-circle';
      } else {
        return 'check';
      }
    }
  }

  get iconColor() {
    if (this.isNested && !this.isNestedPresent) {
      return 'has-text-danger';
    } else {
      if (this.numberOfAttrsMissing > 0) {
        return 'has-text-warning';
      } else {
        return 'has-text-success';
      }
    }
  }
}
