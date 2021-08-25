import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import BehandelingVanAgendapunt from 'frontend-lokaalbeslist/models/behandeling-van-agendapunt';
import Mandataris from 'frontend-lokaalbeslist/models/mandataris';
import Persoon from 'frontend-lokaalbeslist/models/persoon';
import Zitting from 'frontend-lokaalbeslist/models/zitting';

type MaybePromise<A> = PromiseLike<A> | A;

interface Aanwezigen {
    voorzitter?: MaybePromise<Persoon>;
    secretaris?: MaybePromise<Persoon>;
    other: Persoon[];
}

interface Arguments {
    model: BehandelingVanAgendapunt | Zitting
}

export default class AanwezigenTagsComponent extends Component<Arguments> {
    @tracked
    aanwezigen?: Aanwezigen;

    constructor(owner: unknown, args: Arguments) {
        super(owner, args);

        // @ts-ignore
        this.getAanwezigen.perform();
    }

    get aanwezigenCount() {
        if (!this.aanwezigen) {
            return 0;
        }
        let count = this.aanwezigen.other.length;

        if (this.aanwezigen.voorzitter) {
            count++;
        }

        if (this.aanwezigen.secretaris) {
            count++;
        }

        return count;
    }

    isZitting(obj: any): obj is Zitting {
        return obj.aanwezigenBijStart !== undefined;
    }

    @task
    *getAanwezigen() {
        const model: Zitting | BehandelingVanAgendapunt = yield this.args.model;
        const voorzitter: Mandataris = yield model?.voorzitter;
        const secretaris: Mandataris = yield model?.secretaris;

        let aanwezigen: Mandataris[];
        if (this.isZitting(model)) {
            aanwezigen = yield model?.aanwezigenBijStart;
        } else {
            aanwezigen = yield model?.aanwezigen;
        }

        if (!aanwezigen) {
            aanwezigen = [];
        }

        const voorzitterPerson: Persoon = yield voorzitter?.isBestuurlijkeAliasVan;
        const secretarisPerson: Persoon = yield secretaris?.isBestuurlijkeAliasVan;
        const otherPersons: Persoon[] = yield Promise.all(aanwezigen.map(
            (mandataris) => mandataris.isBestuurlijkeAliasVan
        ));

        this.aanwezigen = {
            voorzitter: voorzitterPerson,
            secretaris: secretarisPerson,
            other: otherPersons.filter(
                (x) => (
                    !!x && x !== voorzitterPerson && x !== secretarisPerson
                )
            )
        }

        console.log(this.aanwezigen);
    }
}
