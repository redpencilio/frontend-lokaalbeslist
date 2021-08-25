import Route from '@ember/routing/route';
import Zitting from 'frontend-lokaalbeslist/models/zitting';
import RSVP from 'rsvp';

interface ZittingModel {
    zitting: Zitting;
}

interface ZittingQueryParams {
    zitting_id: string;
}

export default class ZittingRoute extends Route<ZittingModel> {
    model(params: ZittingQueryParams): Promise<ZittingModel> {
        const zitting: PromiseLike<Zitting> = this.store.findRecord('zitting', params.zitting_id);

        return RSVP.hash({
            zitting,
        });
    }
}
