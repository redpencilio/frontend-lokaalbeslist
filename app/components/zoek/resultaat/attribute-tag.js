import { AGENDA_POINT_ATTRIBUTES } from '../../../utils/attributes';

import Component from '@glimmer/component';

/**
 * A tag component highlighting how many (if any) missing attributes there are.
 * Does icon selection and icon coloring depending on the results as well.
 *
 * @see {@link AGENDA_POINT_ATTRIBUTES} for the data this component acts on.
 *
 * @argument {object} result The search result (with all attributes)
 * @argument {string} entity The entity of which the attributes should be considered.
 * @argument {string | undefined} entityName Entity name that will be displayed in case of nested entities.
 * @argument {string | undefined} nested What the root attribute is when an entity is nested (typically the entity URL)
 */
export default class ZoekResultaatAttributeTagComponent extends Component {
  get numberOfAttrsMissing() {
    return this.missingAttributes.filter(([_, { count }]) => count == true)
      .length;
  }

  get missingAttributes() {
    let result = this.args.result;
    let emptyAttrs = Object.entries(AGENDA_POINT_ATTRIBUTES)
      // Only get attributes from the entity we are interested in (e.g. `zitting`)
      .filter(([_, { entity }]) => entity == this.args.entity)

      // Only get empty attributes
      .filter(
        ([prop, _]) => result[prop] === null || result[prop] === undefined
      );

    return emptyAttrs;
  }

  get isNested() {
    return !!this.args.nested;
  }

  get isNestedPresent() {
    let nested = this.args.result[this.args.nested];
    return nested && true;
  }

  // Visuals (move branch spaghetti here instead of in template)
  // -------

  get displayEntityName() {
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
