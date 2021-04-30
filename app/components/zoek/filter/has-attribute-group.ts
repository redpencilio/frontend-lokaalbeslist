import { action } from '@ember/object';
import Component from '@glimmer/component';

import {
  AGENDA_POINT_ATTRIBUTES,
  isResourceConfig,
} from 'frontend-poc-participatie/utils/attributes';

interface Args {
  currentState: Set<string>;
  update(state: Set<string>): void;
}

export default class ZoekFilterHasAttributeGroup extends Component<Args> {
  get AGENDA_POINT_ATTRIBUTES() {
    return AGENDA_POINT_ATTRIBUTES;
  }

  get nonRootEntities(): string[] {
    return Object.entries(AGENDA_POINT_ATTRIBUTES.attributes)
      .filter(([_key, config]) => isResourceConfig(config))
      .map(([key, _config]) => key);
  }

  get entities(): string[] {
    return ['root'].concat(this.nonRootEntities);
  }

  @action
  update(property: string, event: Event) {
    let checked: boolean = (event.target as any).checked;
    let newState = new Set(this.args.currentState);
    checked ? newState.add(property) : newState.delete(property);
    this.args.update(newState);
  }

  @action
  updateNested(entity: string, property: string, event: Event) {
    entity === 'root'
      ? this.update(property, event)
      : this.update(`${entity}.${property}`, event);
  }
}
