
/**
 * Options for moveTableRow
 */
export interface MoveTableRowOptions {
    /**
     * The source row index to move from.
     */
    from: number;

    /**
     * The destination row index to move to.
     */
    to: number;

    /**
     * Whether to select the moved row after the operation.
     *
     * @default true
     */
    select?: boolean;

    /**
     * Optional position to resolve table from. If not provided, uses the current selection.
     */
    pos?: number;
}
