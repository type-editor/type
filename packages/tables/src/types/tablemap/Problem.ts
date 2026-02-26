import type {ColWidths} from './ColWidths';

/**
 * Represents a problem detected in table structure during map computation.
 * Problems are used by the table normalizer to fix structural issues.
 */
export type Problem =
    | {
    /** Column width mismatch between cells in the same column */
    type: 'colwidth mismatch';
    /** Table-relative position of the problematic cell */
    pos: number;
    /** The expected column widths */
    colwidth: ColWidths;
}
    | {
    /** Cell collision - multiple cells occupy the same position */
    type: 'collision';
    /** Table-relative position of the colliding cell */
    pos: number;
    /** Row index where collision occurred */
    row: number;
    /** Number of overlapping columns */
    n: number;
}
    | {
    /** Missing cells in a row */
    type: 'missing';
    /** Row index with missing cells */
    row: number;
    /** Number of missing cells */
    n: number;
}
    | {
    /** Rowspan extends beyond table height */
    type: 'overlong_rowspan';
    /** Table-relative position of the cell with overlong rowspan */
    pos: number;
    /** Number of rows that extend beyond the table */
    n: number;
}
    | {
    /** Table has zero width or height */
    type: 'zero_sized';
};
