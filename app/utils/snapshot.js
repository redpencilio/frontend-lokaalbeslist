/**
 * A class for snapshotting objects and checking wether any field has changed.
 *
 * Source: <https://github.com/lblod/frontend-toezicht-abb/blob/master/app/utils/snapshot.js>
 */
export default class Snapshot {
  base = null;
  future = null;

  constructor(base) {
    this.base = base;
  }

  stage(object) {
    this.future = Object.assign(object, {});
  }

  stageLive(object) {
    this.future = object;
  }

  commit() {
    this.base = Object.assign(this.future, {});
  }

  /**
   * @param {array} fields An array of fields to check for changes
   * @param {array} exclude An array of fields to exclude from checking
   * @returns {boolean} Wether any field has changed (except fields from @exclude)
   */
  anyFieldChanged(fields, exclude) {
    let filteredFields = exclude
      ? fields.filter((key) => !exclude.includes(key))
      : fields;

    for (let field of filteredFields) {
      if (this.fieldChanged(field)) return true;
    }
    return false;
  }

  fieldChanged(field) {
    if (!this.hasBase || !this.hasStaging) {
      return (
        Object.prototype.hasOwnProperty.call(this.baseOrEmpty, field) ||
        Object.prototype.hasOwnProperty.call(this.futureOrEmpty, field)
      );
    } else {
      return this.base[field] != this.future[field];
    }
  }

  get hasBase() {
    return this.base && true;
  }

  get hasStaging() {
    return this.future && true;
  }

  get committed() {
    return this.base;
  }

  get baseOrEmpty() {
    return this.base || {};
  }

  get futureOrEmpty() {
    return this.future || {};
  }
}
