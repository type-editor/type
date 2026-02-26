import type {PmNode} from '@type-editor/model';

import {TableMap} from '../../tablemap/TableMap';
import {type Rect} from '../tablemap/Rect';

/**
 * Represents a rectangular region within a table, extended with table-specific information.
 * This type combines the basic rectangle coordinates with the table context needed for operations.
 */
export type TableRect = Rect & {
    /** The position where the table content starts in the document */
    tableStart: number;
    /** The table map providing cell position information */
    map: TableMap;
    /** The table node itself */
    table: PmNode;
};
