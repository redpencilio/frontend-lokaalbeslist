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

  get isChild() {
    return !!this.args.filter.parentFilter?.content;
  }

  @action
  addConstraint(event: Event) {
    event.preventDefault();
    const newConstraint = this.store.createRecord(
      'subscription-filter-constraint',
      {
        subject: 'title',
        predicate: 'textContains',
        object: '',
      }
    );
    this.args.filter.constraints.addObject(newConstraint);
  }

  @action
  addFilter(event: Event) {
    event.preventDefault();
    const constraint = this.store.createRecord(
      'subscription-filter-constraint',
      {
        subject: 'title',
        predicate: 'textEquals',
        object: '',
      }
    )
    const newFilter = this.store.createRecord(
      'subscription-filter',
      {
        requireAll: true,
        constraints: [constraint],
      }
    );

    this.args.filter.subFilters.addObject(newFilter);
  }

  @action
  removeConstraint(constraint: SubscriptionFilterConstraint) {
    this.args.filter.constraints.removeObject(constraint);
  }

  @action
  removeFilter() {
    this.args.filter.destroyRecord();
  }
}
