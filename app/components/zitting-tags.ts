import Component from '@glimmer/component';
import Zitting from 'frontend-lokaalbeslist/models/zitting';

interface Arguments {
    zitting?: Zitting;
    showAanwezigen?: boolean;
}

export default class ZittingTagsComponent extends Component<Arguments> {
    get bestuursNaam() {
        // Try to get the most specific name
        const bestuursorgaan = this.args.zitting?.get('bestuursorgaan');
        const bestuurseenheid = bestuursorgaan?.get('bestuurseenheid');
        const werkingsgebied = bestuurseenheid?.get('werkingsgebied');

        return werkingsgebied?.get('naam') ||
               bestuurseenheid?.get('naam') ||
               bestuursorgaan?.get('naam') ||
               'onbekend';
    }
}
