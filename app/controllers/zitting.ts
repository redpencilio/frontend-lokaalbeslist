import Controller from '@ember/controller';

export default class SearchController extends Controller {
    get aanwezigenCount() {
        let count = this.model.aanwezigen.other.length;

        if (this.model.aanwezigen.voorzitter) {
            count++;
        }

        if (this.model.aanwezigen.secretaris) {
            count++;
        }

        return count;
    }

    get bestuursNaam() {
        // Try to get the most specific name
        const bestuursorgaan = this.model.zitting.get('bestuursorgaan');
        const bestuurseenheid = bestuursorgaan?.get('bestuurseenheid');
        const werkingsgebied = bestuurseenheid?.get('werkingsgebied');

        return werkingsgebied?.get('naam') ||
               bestuurseenheid?.get('naam') ||
               bestuursorgaan?.get('naam') ||
               'onbekend';
    }
}
