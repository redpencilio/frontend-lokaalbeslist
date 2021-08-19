import Route from '@ember/routing/route';
import Persoon from 'frontend-lokaalbeslist/models/persoon';
import Zitting from 'frontend-lokaalbeslist/models/zitting';
import RSVP from 'rsvp';

interface ZittingModel {
    zitting: PromiseLike<Zitting> | Zitting;
    aanwezigen: PromiseLike<Aanwezigen> | Aanwezigen;
}

interface ZittingQueryParams {
    zitting_id: string;
}

interface Aanwezigen {
    voorzitter?: Persoon;
    secretaris?: Persoon;
    other: Persoon[];
}

export default class ZittingRoute extends Route<ZittingModel> {
    model(params: ZittingQueryParams): Promise<ZittingModel> {
        const zitting: PromiseLike<Zitting> = this.store.findRecord('zitting', params.zitting_id);

        const aanwezigen: PromiseLike<Aanwezigen> = zitting.then(this.getAanwezigen);

        return RSVP.hash({
            aanwezigen,
            zitting,
        });
    }

    async getAanwezigen(zitting: Zitting): Promise<Aanwezigen> {
        const [voorzitter, secretaris, aanwezigenBijStart] = await Promise.all([
            zitting.voorzitter,
            zitting.secretaris,
            zitting.aanwezigenBijStart
        ]);
        return await RSVP.hash({
            voorzitter: voorzitter.isBestuurlijkeAliasVan,
            secretaris: secretaris.isBestuurlijkeAliasVan,
            other: aanwezigenBijStart.filter(
                (x) => (!!x && x !== voorzitter && x !== secretaris)
            ).map((mandataris) => mandataris.isBestuurlijkeAliasVan)
        });
    }
}
