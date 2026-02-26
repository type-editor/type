/**
 * Configuration options for the toggleHeader command.
 */
export interface ToggleHeaderOptions {
    /**
     * If true, toggles the selected row/column instead of the first one.
     * Only applies when type is 'row' or 'column'.
     */
    useSelectedRowColumn?: boolean;
}
