import type {Slice} from '@type-editor/model';

import type {PmSelection} from '../../state';

export interface PmDragging {
    readonly slice: Slice;
    readonly move: boolean;
    readonly nodeSelection: PmSelection | undefined;
}
