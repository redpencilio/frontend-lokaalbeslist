import Transform from '@ember-data/serializer/transform';

export class Motivering {
    declare content: string;
    declare language: string;
}

export default class MotiveringTransform extends Transform {

    deserialize(serialized: Motivering): Motivering {
        return serialized;
    }

}

declare module 'ember-data/types/registries/transform' {
    export default interface TransformRegistry {
        'motivering': MotiveringTransform
    }
}
