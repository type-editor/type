/**
 * Options for moveTableColumn
 */
export interface MoveTableColumnOptions {
    /**
     * The source column index to move from.
     */
    from: number;

    /**
     * The destination column index to move to.
     */
    to: number;

    /**
     * Whether to select the moved column after the operation.
     *
     * @default true
     */
    select?: boolean;

    /**
     * Optional position to resolve table from. If not provided, uses the current selection.
     */
    pos?: number;
}
