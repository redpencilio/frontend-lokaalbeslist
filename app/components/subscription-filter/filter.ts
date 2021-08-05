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

  defaultGovernanceArea: string = "Langemark-Poelkapelle"

  @tracked
  advancedFilters: boolean = false;

  constructor(owner: unknown, args: FilterComponentArgs) {
    super(owner, args);

    this.resetFilter().catch(console.error);
  }

  async resetFilter() {
    await this.args.filter.constraints.clear();
    await this.addGovernanceAreaConstraint(this.defaultGovernanceArea);
  }

  async addGovernanceAreaConstraint(value: string) {
    const constraint = this.store.createRecord('subscription-filter-constraint');
    constraint.subject = 'governanceArea';
    constraint.predicate = 'governanceAreaEquals';
    constraint.object = value;
    this.args.filter.constraints.pushObject(constraint);
  }

  @action
  async changeSelectedGovernanceArea(value: string) {
    await this.args.filter.constraints.clear();
    await this.addGovernanceAreaConstraint(value);
  }

  @action
  async setAdvancedFilters(value: boolean) {
    // If we're switching back to non-advanced, reset the filters
    if (!value) {
      await this.resetFilter();
    }
    this.advancedFilters = value;
  }
}
