import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import SubscriptionFilter from "frontend-lokaalbeslist/models/subscription-filter";

interface FilterComponentArgs {
  filter: SubscriptionFilter;
}

export default class FilterComponent extends Component<FilterComponentArgs> {
  @service declare store: Store;

  @tracked
  advancedFilters: boolean = false;

  @tracked
  selectedGovernanceAreas: string[] = [];

  constructor(owner: unknown, args: FilterComponentArgs) {
    super(owner, args);
  }

  async addGovernanceAreaConstraint(value: string) {
    const constraint = this.store.createRecord('subscription-filter-constraint');
    constraint.subject = 'governanceArea';
    constraint.predicate = 'governanceAreaEquals';
    constraint.object = value;
    this.args.filter.constraints.pushObject(constraint);
  }

  @action
  async changeSelectedGovernanceAreas(values: string[]) {
    await this.args.filter.constraints.clear();
    await Promise.all(values.map((value) =>  this.addGovernanceAreaConstraint(value)));
  }

  @action
  async setAdvancedFilters(value: boolean) {
    // If we're switching back to non-advanced, reset the filter
    if (!value) {
        await this.args.filter.constraints.clear();
        this.args.filter.requireAll = false;
    }
    this.advancedFilters = value;
  }
}
