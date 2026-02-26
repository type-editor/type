import type {Mappable} from './Mappable';
import type {PmStepMap} from './PmStepMap';

export interface PmMapping extends Mappable {

    readonly maps: ReadonlyArray<PmStepMap>;

    slice(from?: number, to?: number): PmMapping

    appendMap(map: PmStepMap, mirrors?: number): void;

    appendMapping(mapping: PmMapping): void;

    getMirror(offset: number): number | undefined;

    setMirror(offset: number, mirrorOffset: number): void

    invert(): PmMapping;
}
