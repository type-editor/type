import type {Slice} from '@type-editor/model';

export interface ReplacementRange {
    from: number,
    to: number,
    insert: Slice
}
