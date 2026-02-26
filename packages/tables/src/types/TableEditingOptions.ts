
export interface TableEditingOptions {
    /**
     * Whether to allow table node selection.
     *
     * By default, any node selection wrapping a table will be converted into a
     * CellSelection wrapping all cells in the table. You can pass `true` to allow
     * the selection to remain a NodeSelection.
     *
     * @default false
     */
    allowTableNodeSelection?: boolean;
}
