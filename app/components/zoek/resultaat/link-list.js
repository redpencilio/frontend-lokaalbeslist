import Component from '@glimmer/component';

export default class ZoekResultaatLinkListComponent extends Component {
  get resolutions() {
    let resolutions = this.args.result.generatedResolutionURIs;
    if (!resolutions) {
      return [];
    }

    if (Array.isArray(resolutions)) {
      return resolutions.map((link, index) => ({ link, index: index + 1 }));
    } else {
      return [{ link: resolutions, index: '' }];
    }
  }
}
