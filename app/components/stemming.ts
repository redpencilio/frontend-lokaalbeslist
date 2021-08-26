import Component from '@glimmer/component';
import Stemming from 'frontend-lokaalbeslist/models/stemming';

interface StemmingComponentArgs {
    stemming: Stemming;
}

export default class StemmingComponentComponent extends Component<StemmingComponentArgs> {
    get hasMandatarissen() {
        return this.args.stemming.voorstanders.length !== 0 ||
            this.args.stemming.tegenstanders.length !== 0 ||
            this.args.stemming.onthouders.length !== 0;
    }

    getStemmingPersonen(type: 'voorstanders'|'tegenstanders'|'onthouders') {
        return this.args.stemming.get(type).map((mandataris) => mandataris.isBestuurlijkeAliasVan);
    }

    get voorstanderPersonen() {
        return this.getStemmingPersonen('voorstanders');
    }

    get tegenstanderPersonen() {
        return this.getStemmingPersonen('tegenstanders');
    }

    get onthouderPersonen() {
        return this.getStemmingPersonen('onthouders');
    }

    get aantalVoorstanders() {
        return this.args.stemming.aantalVoorstanders || this.args.stemming.voorstanders.length;
    }

    get aantalTegenstanders() {
        return this.args.stemming.aantalTegenstanders || this.args.stemming.tegenstanders.length;
    }

    get aantalOnthouders() {
        return this.args.stemming.aantalOnthouders || this.args.stemming.onthouders.length;
    }
}
