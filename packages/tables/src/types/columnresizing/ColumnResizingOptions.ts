import type {NodeView, PmEditorView} from '@type-editor/editor-types';
import type {PmNode} from '@type-editor/model';

/**
 * Configuration options for the column resizing plugin.
 */
export interface ColumnResizingOptions {
    /**
     * The width in pixels of the resize handle zone at column edges.
     * When the mouse is within this distance from a column edge, the resize handle becomes active.
     * @default 5
     */
    handleWidth?: number;
    /**
     * Minimum width of a cell/column in pixels. The column cannot be resized smaller than this.
     * @default 25
     */
    cellMinWidth?: number;
    /**
     * The default minimum width of a cell/column in pixels when it doesn't have an explicit width
     * (i.e., it has not been resized manually).
     * @default 100
     */
    defaultCellMinWidth?: number;
    /**
     * Whether the last column of the table can be resized.
     * @default true
     */
    lastColumnResizable?: boolean;
    /**
     * A custom node view constructor for rendering table nodes. By default, the plugin
     * uses the {@link TableView} class. Set this to `null` to disable the custom node view.
     * @default TableView
     */
    View?:
        | (new (node: PmNode, cellMinWidth: number, view: PmEditorView,) => NodeView)
        | null;
}
