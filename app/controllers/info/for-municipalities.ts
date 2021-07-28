import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { timeout } from 'ember-concurrency';
import { restartableTask, task } from 'ember-concurrency-decorators';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import RouterService from '@ember/routing/router-service';

// @ts-ignore
import hljs from 'highlight.js/lib/core';

import { filterOutCompositeAreas } from 'frontend-lokaalbeslist/models/werkingsgebied';

export default class InfoForMunicipalitiesController extends Controller {
  @service declare store: Store;
  @service declare router: RouterService;

  @tracked
  rendered: boolean = false;

  @tracked
  selectedGovernanceArea: string = 'Langemark-Poelkapelle';

  @tracked
  options: string[] = [];

  constructor() {
    super(...arguments);
    // @ts-ignore
    this.loadData.perform();
  }

  get codeSnippet(): string {
    let selected = this.selectedGovernanceArea.toLowerCase();

    // Attempt at guessing the server this is running on.
    let server = window.location.href.replace(this.router.currentURL, '');

    // prettier-ignore
    return `<iframe
  src="${server}${this.router.urlFor('search-embedded', {embedded: selected})}/"
  title="LokaalBeslist"
  width="100%"
  height="800px"
  frameborder="0"
/>`;
  }

  get codeSnippetHighlighted(): string {
    let selected = this.selectedGovernanceArea.toLowerCase();
    return hljs
      .highlight(this.codeSnippet, { language: 'xml' })
      .value.replace(selected, `<strong>${selected}</strong>`);
  }

  @action
  changeSelectedGovernanceArea(value: string): void {
    this.selectedGovernanceArea = value;
    document
      .querySelector('#embed-code-block')
      ?.classList.add('changed-content');
  }

  @task
  *loadData(): Generator<Promise<string[]>> {
    this.options = this.store
      .query('werkingsgebied', {
        sort: 'naam',
      })
      .filter(filterOutCompositeAreas)
      .map((area) => area.naam)
      .uniq();
  }

  @restartableTask
  *search(term: string) {
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
  copyCodeToClipboard() {
    navigator.clipboard.writeText(this.codeSnippet).catch(function (err) {
      alert('Code kopiëren mislukt.');
      console.error('Could not copy text: ', err);
    });
  }

  @action
  hideEmbedded(): void {
    this.rendered = false;
  }

  @action
  showEmbedded(): void {
    this.rendered = true;
  }

  @action
  onAnimationEnd(event: any): void {
    event.target.classList.remove('changed-content');
  }
}
