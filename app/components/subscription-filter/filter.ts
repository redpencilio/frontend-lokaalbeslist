import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import SubscriptionFilter from "frontend-lokaalbeslist/models/subscription-filter";
import SubscriptionFilterConstraint from "frontend-lokaalbeslist/models/subscription-filter-constraint";
import RouterService from '@ember/routing/router-service';

interface FilterComponentArgs {
  filter: SubscriptionFilter;
  allowDelete: boolean;
  requireEmail: boolean;
  title?: string;
  setErrors?: (errors: FilterFormErrors) => void;

  // https://www.youtube.com/watch?v=eVTXPUF4Oz4
  // We tried. So hard. To just have onSave?: () => void;
  // But ember. Dear Ember. Does not kindle our flames.
  transitionToOnSave: string | undefined;
}

export interface FilterFormErrors {
  email?: string;
  simpleGovernanceArea?: string;
  filter?: SubscriptionFilterError;
}

export interface SubscriptionFilterError {
  subFilterErrors: SubscriptionFilterError[];
  constraintErrors: SubscriptionFilterConstraintError[];
  errorMessage?: string;
}

export interface SubscriptionFilterConstraintError {
  subjectError?: string;
  predicateError?: string;
  objectError?: string;
}

const FREQUENCIES: Frequency[] = ['daily', 'weekly', 'monthly'];
type Frequency = 'daily' | 'weekly' | 'monthly'

export default class FilterComponent extends Component<FilterComponentArgs> {
  @service declare store: Store;
  @service declare router: RouterService;

  @tracked
  advancedFiltersSetting: boolean = false;

  @tracked
  selectedGovernanceAreas: string[] = [];

  @tracked
  errors: FilterFormErrors = {};

  freqDisplayValues: {[key in Frequency]: string} = {
    'daily': 'Dagelijks',
    'weekly': 'Wekelijks',
    'monthly': 'Maandelijks',
  }

  get frequencies() {
    return FREQUENCIES;
  }

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

  @action
  changeFrequency(value: Frequency): void {
    this.args.filter.frequency = value;
  }

  get title() {
    return this.args.title || "Abonnement";
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
    this.selectedGovernanceAreas = values;
  }

  @action
  setAdvancedFilters(value: boolean) {
    // If we're switching back to non-advanced, reset the filter
    if (!value) {
        this.toSimpleFilters();
    }
    this.advancedFiltersSetting = value;
  }

  validate() {
    this.errors = {};
    if (this.args.requireEmail && !this.args.filter.email) {
      this.errors.email = "Vul een e-mail adres in."
    }

    if (this.advancedFilters) {
      this.errors.filter = this.validateSubscriptionFilter(this.args.filter);
    } else {
      if (this.selectedGovernanceAreas.length === 0) {
        this.errors.simpleGovernanceArea = "Selecteer minstens 1."
      }
    }

    this.errors = this.errors;

    if (this.args.setErrors) {
      this.args.setErrors(this.errors);
    }
  }

  validateSubscriptionFilter(filter: SubscriptionFilter): SubscriptionFilterError {
    let ret: SubscriptionFilterError = {
      subFilterErrors: filter.subFilters.map(this.validateSubscriptionFilter.bind(this)),
      constraintErrors: filter.constraints.map(this.validateSubscriptionFilterConstraint.bind(this)),
    };

    if (filter.subFilters.length === 0 && filter.constraints.length === 0) {
      ret.errorMessage = "Lege groepen zijn niet toegestaan";
    }

    return ret;
  }

  validateSubscriptionFilterConstraint(constraint: SubscriptionFilterConstraint): SubscriptionFilterConstraintError {
    let ret: SubscriptionFilterConstraintError = {}

    if (!constraint.subject) {
      ret.subjectError = 'Kies een onderwerp'
    }

    if (!constraint.predicate) {
      ret.predicateError = 'Kies een eigenschap'
    }

    if (!constraint.object && (
      constraint.predicate !== 'exists' &&
      constraint.predicate !== 'notExists'
    )) {
      ret.objectError = 'Kies een waarde'
    }

    return ret;
  }

  @action
  saveFilter(event: Event) {
    event.preventDefault();
    this.validate();

    if (this.hasErrors) {
      return;
    }

    let result = this.recursiveSave(this.args.filter);
    result = result.then(() => {
      if (this.args.transitionToOnSave) {
        this.router.transitionTo(this.args.transitionToOnSave);
      }
    })
    return result;
  }

  get hasErrors(): boolean {
    return !!this.errors.email || !!this.errors.simpleGovernanceArea || this.hasFilterErrors(this.errors.filter);
  }

  hasFilterErrors(filterError: SubscriptionFilterError | undefined): boolean {
    
    if (!filterError) {
      return false;
    }

    return filterError.subFilterErrors.any(this.hasFilterErrors) ||
      filterError.constraintErrors.any((constraint) => {
        return (!!constraint.subjectError || !!constraint.predicateError || !!constraint.objectError)
      })
  }

  async recursiveSave(filter: SubscriptionFilter) {
    await Promise.all(
      filter.subFilters.map(async (subFilter) => {
        await this.recursiveSave(subFilter)
      })
    );
    await Promise.all(
      filter.constraints.map(async (x) => await x.save())
    )

    await filter.save()
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
