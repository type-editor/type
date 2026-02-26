import type {Fragment} from '@type-editor/model';

/**
 * Represents a rectangular area of table cells.
 *
 * This structure is used to represent a block of cells that can be
 * copied, pasted, or manipulated as a unit.
 */
export interface Area {
    /** The number of columns in the area (accounting for colspan). */
    width: number;
    /** The number of rows in the area (accounting for rowspan). */
    height: number;
    /** The rows of cells, where each row is a Fragment containing cell nodes. */
    rows: Array<Fragment>;
}
