import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import SubscriptionFilter from "frontend-lokaalbeslist/models/subscription-filter";
import SubscriptionFilterConstraint from "frontend-lokaalbeslist/models/subscription-filter-constraint";

interface FilterComponentArgs {
  filter: SubscriptionFilter;
  allowDelete: boolean;
  title?: string;
}

export default class FilterComponent extends Component<FilterComponentArgs> {
  @service declare store: Store;

  @tracked
  advancedFiltersSetting: boolean = false;

  @tracked
  selectedGovernanceAreas: string[] = [];

  constructor(owner: unknown, args: FilterComponentArgs) {
    super(owner, args);

    if (!this.containsAdvancedFilters) {
      this.toSimpleFilters();
    }
  }

  async toSimpleFilters() {
    this.args.filter.requireAll = false;
    this.selectedGovernanceAreas.clear();
    this.args.filter.constraints.forEach((constraint) => {
      if (constraint.subject === 'governanceArea' &&
          constraint.predicate === 'governanceAreaEquals' &&
          constraint.object !== undefined) {
        this.selectedGovernanceAreas.addObject(constraint.object);
      }
    })
  }

  get title() {
    return this.args.title || "Filters";
  }

  get containsAdvancedFilters() {
    const advancedConstraints = this.args.filter.constraints.filter(
      (constraint: SubscriptionFilterConstraint) => {
        return constraint.subject !== 'governanceArea' ||
               constraint.predicate !== 'governanceAreaEquals';
      }
    );

    return this.args.filter.subFilters.length !== 0 || advancedConstraints.length !== 0;
  }

  get advancedFilters() {
    if (this.containsAdvancedFilters) {
      this.advancedFiltersSetting = true;
    }
    return this.advancedFiltersSetting;
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
        this.toSimpleFilters();
    }
    this.advancedFiltersSetting = value;
  }

  @action
  saveFilter(event: Event) {
    //TODO: validate & error messages
    event.preventDefault();
    Promise.all(this.args.filter.constraints.map((x) => x.save())).then(() => {
      Promise.all(this.args.filter.subFilters.map((x) => x.save())).then(() => {
        this.args.filter.save()
      });
    });
  }

  @action
  deleteFilter(event: Event) {
    event.preventDefault();
    this.selectedGovernanceAreas.clear();
    Promise.all(this.args.filter.constraints.map((x) => x.destroyRecord())).then(() => {
      this.args.filter.destroyRecord();
    });
  }
}
