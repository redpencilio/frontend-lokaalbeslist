import Component from '@glimmer/component';
import {
  ConstraintObjectType,
  ConstraintPredicate,
  constraintPredicates, ConstraintSubject,
  constraintSubjects
} from "frontend-lokaalbeslist/utils/constraints";
import SubscriptionFilterConstraint from 'frontend-lokaalbeslist/models/subscription-filter-constraint';
import { action } from '@ember/object';

interface ConstraintComponentArgs {
  constraint: SubscriptionFilterConstraint;
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
    } else if (['title', 'description', 'sessionLocation'].includes(subject)) {
      return type === ConstraintObjectType.Text;
    } else if (['sessionDate'].includes(subject)) {
      return type === ConstraintObjectType.Date;
    }
    return false;
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
      case 'exists':
      case 'notExists':
        return ConstraintObjectType.None;
    }
    // Should be unreachable
    return ConstraintObjectType.None;
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
