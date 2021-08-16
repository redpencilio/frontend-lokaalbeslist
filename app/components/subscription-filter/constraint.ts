import Component from "@glimmer/component";
import {
  ConstraintObjectType,
  ConstraintPredicate,
  constraintPredicates,
  ConstraintSubject,
  constraintSubjects
} from "frontend-lokaalbeslist/utils/constraints";
import SubscriptionFilterConstraint from "frontend-lokaalbeslist/models/subscription-filter-constraint";
import { action } from "@ember/object";
import { SubscriptionFilterConstraintError } from "./filter";

interface ConstraintComponentArgs {
  constraint: SubscriptionFilterConstraint;
  errors: SubscriptionFilterConstraintError;
}

export default class ConstraintComponent extends Component<ConstraintComponentArgs> {
  get subjects() {
    return constraintSubjects;
  }

  get predicates() {
    return constraintPredicates.filter((pred) => this.allowedPredicate(
      pred,
      this.args.constraint.subject
    ));
  }

  allowedPredicate(predicate: ConstraintPredicate, subject: ConstraintSubject): boolean {
    const type = this.predicateObjectType(predicate);
    if (type === ConstraintObjectType.None) {
      return true;
    }

    switch (subject) {
      case 'title':
      case 'description':
      case 'sessionLocation':
        return type === ConstraintObjectType.Text
      case "sessionDate":
        return type === ConstraintObjectType.Date
      case "governanceArea":
        return type === ConstraintObjectType.GovernanceArea
    }
  }

  predicateObjectType(predicate: ConstraintPredicate): ConstraintObjectType {
    switch (predicate) {
      case 'textEquals':
      case 'textContains':
        return ConstraintObjectType.Text;
      case 'dateEquals':
      case 'dateIsBefore':
      case 'dateIsAfter':
        return ConstraintObjectType.Date;
      case "governanceAreaEquals":
        return ConstraintObjectType.GovernanceArea;
      case 'exists':
      case 'notExists':
        return ConstraintObjectType.None;
    }
  }

  get objectType() {
    return this.predicateObjectType(this.args.constraint.predicate);
  }

  get showText() {
    return this.objectType == ConstraintObjectType.Text;
  }

  get showDate() {
    return this.objectType == ConstraintObjectType.Date;
  }

  get showGovernanceArea() {
    return this.objectType == ConstraintObjectType.GovernanceArea;
  }

  @action
  setObject(event: Event) {
    this.args.constraint.object = (event.target as HTMLInputElement).value;
  }

  @action
  setSubject(subject: ConstraintSubject) {
    this.args.constraint.subject = subject;
    if (!this.allowedPredicate(this.args.constraint.predicate, subject)) {
      this.args.constraint.predicate = this.predicates[0];
    }
  }
}
