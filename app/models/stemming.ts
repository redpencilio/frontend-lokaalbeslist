import Model, { attr, hasMany } from "@ember-data/model";
import DS from "ember-data";
import Mandataris from "./mandataris";

export default class Stemming extends Model {
    @attr('number') declare aantalVoorstanders: number;
    @attr('number') declare aantalTegenstanders: number;
    @attr('number') declare aantalOnthouders: number;

    @hasMany('mandataris') declare voorstanders: DS.PromiseArray<Mandataris>;
    @hasMany('mandataris') declare tegenstanders: DS.PromiseArray<Mandataris>;
    @hasMany('mandataris') declare onthouders: DS.PromiseArray<Mandataris>;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'stemming': Stemming;
  }
}
