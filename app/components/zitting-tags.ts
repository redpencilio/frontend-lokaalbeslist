import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
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
    zitting?: Zitting
}

export default class ZittingTagsComponent extends Component<Arguments> {
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

    @task
    *getAanwezigen() {
        const zitting: Zitting = yield this.args.zitting;
        const voorzitter: Mandataris = yield zitting?.voorzitter;
        const secretaris: Mandataris = yield zitting?.secretaris;
        let aanwezigenBijStart: Mandataris[] = yield zitting?.aanwezigenBijStart;

        if (!aanwezigenBijStart) {
            aanwezigenBijStart = [];
        }

        const voorzitterPerson: Persoon = yield voorzitter?.isBestuurlijkeAliasVan;
        const secretarisPerson: Persoon = yield secretaris?.isBestuurlijkeAliasVan;
        const otherPersons: Persoon[] = yield Promise.all(aanwezigenBijStart.map(
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
    }
}
