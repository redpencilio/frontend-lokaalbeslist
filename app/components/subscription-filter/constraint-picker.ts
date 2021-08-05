import Component from '@glimmer/component';
import { inject as service}  from '@ember/service';
import SubscriptionFilterConstraint from 'frontend-lokaalbeslist/models/subscription-filter-constraint';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import SubscriptionFilter from "frontend-lokaalbeslist/models/subscription-filter";

interface ConstraintPickerComponentArgs {
  filter: SubscriptionFilter
}

export default class ConstraintPickerComponent extends Component<ConstraintPickerComponentArgs> {
  @service declare store: Store;

  constructor(owner: unknown, args: ConstraintPickerComponentArgs) {
    super(owner, args);
  }

  @action
  addConstraint(_event: Event) {
    const newFilter = this.store.createRecord('subscription-filter-constraint')
    newFilter.subject = 'title';
    newFilter.predicate = 'textContains';
    newFilter.object = '';
    this.args.filter.constraints.addObject(newFilter);
  }

  @action
  removeConstraint(constraint: SubscriptionFilterConstraint) {
    this.args.filter.constraints.removeObject(constraint);
  }
}
