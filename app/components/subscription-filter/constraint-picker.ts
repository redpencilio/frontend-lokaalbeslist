import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service}  from '@ember/service';
import SubscriptionFilterConstraint from 'frontend-lokaalbeslist/models/subscription-filter-constraint';
import Store from '@ember-data/store';
import { action } from '@ember/object';

interface ConstraintPickerComponentArgs {}

export default class ConstraintPickerComponent extends Component<ConstraintPickerComponentArgs> {
  @service declare store: Store;

  @tracked
  requireAll: boolean = false;

  @tracked
  constraints: SubscriptionFilterConstraint[] = [];

  constructor(owner: unknown, args: ConstraintPickerComponentArgs) {
    super(owner, args);

    const firstFilter = this.store.createRecord('subscription-filter-constraint');
    firstFilter.subject = 'title';
    firstFilter.predicate = 'textContains';
    firstFilter.object = '';
    this.constraints = [firstFilter];
  }

  @action
  addConstraint(_event: Event) {
    const newFilter = this.store.createRecord('subscription-filter-constraint')
    newFilter.subject = 'title';
    newFilter.predicate = 'textContains';
    newFilter.object = '';
    this.constraints.push(newFilter);
    this.constraints = this.constraints;
  }

  @action
  removeConstraint(constraint: SubscriptionFilterConstraint) {
    this.constraints = this.constraints.filter(c => c != constraint);
  }
}
