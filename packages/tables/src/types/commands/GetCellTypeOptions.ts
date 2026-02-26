import type {PmNode} from '@type-editor/model';

/**
 * Options provided to the getCellType callback in splitCellWithType.
 */
export interface GetCellTypeOptions {
    /** The original cell node being split */
    node: PmNode;
    /** The row index for the cell being created */
    row: number;
    /** The column index for the cell being created */
    col: number;
}
