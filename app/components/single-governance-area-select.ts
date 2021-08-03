import Component from '@glimmer/component';
import { restartableTask } from "ember-concurrency-decorators";
import { timeout } from "ember-concurrency";
import { filterOutCompositeAreas } from "frontend-lokaalbeslist/models/werkingsgebied";
import { inject as service } from "@ember/service";
import Store from "@ember-data/store";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

interface GovernanceAreaSelectArgs {
  onSelect: (value: string) => void;
  initialValue: string;
}

export default class SingleGovernanceAreaSelect extends Component<GovernanceAreaSelectArgs> {
  @service declare store: Store;

  defaultGovernanceArea: string = "Langemark-Poelkapelle"

  @tracked
  governanceAreas: string[] = [];

  @tracked
  selectedGovernanceArea: string;

  constructor(owner: unknown, args: GovernanceAreaSelectArgs) {
    super(owner, args);

    this.selectedGovernanceArea = this.args.initialValue || this.defaultGovernanceArea;

    this.loadData().catch(console.error);
  }

  async loadData() {
    this.governanceAreas = await this.store
      .query('werkingsgebied', {
        sort: 'naam',
      })
      .filter(filterOutCompositeAreas)
      .map((area) => area.naam)
      .uniq();
  }

  @restartableTask
  *searchGovernanceArea(term: string) {
    yield timeout(600);
    return this.store
      .query('werkingsgebied', {
        sort: 'naam',
        filter: term,
      })
      .then((areas) => areas.filter(filterOutCompositeAreas))
      .then((areas) => areas.map((area) => area.naam))
      .then((areas) => areas.uniq());
  }

  @action
  changeGovernanceArea(value: string) {
    this.selectedGovernanceArea = value;
    this.args.onSelect(value);
  }
}
