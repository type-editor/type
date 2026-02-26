/**
 * Represents the attributes of a table cell node.
 *
 * These attributes control cell spanning behavior and column widths.
 */
export interface CellAttrs {
    /** Number of columns this cell spans. Default is 1. */
    colspan: number;
    /** Number of rows this cell spans. Default is 1. */
    rowspan: number;
    /** Array of column widths in pixels, or null if not set. */
    colwidth: Array<number> | null;
}
