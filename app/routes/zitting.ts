import Route from '@ember/routing/route';
import Agendapunt from 'frontend-lokaalbeslist/models/agendapunt';
import Zitting from 'frontend-lokaalbeslist/models/zitting';
import RSVP from 'rsvp';

interface ZittingModel {
    zitting: Zitting;
    agendapuntenSorted: Agendapunt[];
}

interface ZittingQueryParams {
    zitting_id: string;
}

export default class ZittingRoute extends Route<ZittingModel> {
    model(params: ZittingQueryParams): Promise<ZittingModel> {
        const zitting: PromiseLike<Zitting> = this.store.findRecord('zitting', params.zitting_id);

        return RSVP.hash({
            zitting,
            agendapuntenSorted: getAgendapuntenSorted(zitting)
        });
    }
}
async function getAgendapuntenSorted(zittingPromise: PromiseLike<Zitting>): Promise<Agendapunt[]> {
    const zitting = await zittingPromise;
    const agendapunten = await zitting.agendapunten;

    let currentAgendapunt = agendapunten.firstObject;
    let prevAgendapunt = await currentAgendapunt?.vorigeAgendapunt;

    while (prevAgendapunt) {
        currentAgendapunt = prevAgendapunt
        prevAgendapunt = await currentAgendapunt?.vorigeAgendapunt;
    }

    let ret = [];
    let nextAgendapunt = await currentAgendapunt?.volgendAgendapunt;

    while (currentAgendapunt) {
        ret.push(currentAgendapunt);
        currentAgendapunt = nextAgendapunt;
        nextAgendapunt = await currentAgendapunt?.volgendAgendapunt;
    }

    return ret;
}
