import type {ResolvedPos} from '@type-editor/model';

export interface PmSelectionRange {

    readonly $from: ResolvedPos;
    readonly $to: ResolvedPos;
}
