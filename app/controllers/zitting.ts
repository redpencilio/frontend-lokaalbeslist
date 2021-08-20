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
}
