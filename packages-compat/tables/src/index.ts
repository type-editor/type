/**
 * @type-editor-compat/tables
 *
 * Compatibility layer for @type-editor/tables providing ProseMirror-compatible type signatures.
 *
 * Re-exports table plugin and utilities with concrete type signatures.
 * Functions that use PmEditorState, PmTransaction, PmSelection, or Command from the base module
 * are re-exported with type assertions to use compat types instead.
 */

import type {Mappable} from '@type-editor/editor-types';
import type {Direction, Rect} from '@type-editor/tables';
import {
    addColumn as baseAddColumn,
    addColumnAfter as baseAddColumnAfter,
    addColumnBefore as baseAddColumnBefore,
    addRow as baseAddRow,
    addRowAfter as baseAddRowAfter,
    addRowBefore as baseAddRowBefore,
    CellBookmark as BaseCellBookmark,
    CellSelection as BaseCellSelection,
    columnResizing as baseColumnResizing,
    deleteCellSelection as baseDeleteCellSelection,
    deleteColumn as baseDeleteColumn,
    deleteRow as baseDeleteRow,
    deleteTable as baseDeleteTable,
    fixTables as baseFixTables,
    goToNextCell as baseGoToNextCell,
    isInTable as baseIsInTable,
    mergeCells as baseMergeCells,
    moveTableColumn as baseMoveTableColumn,
    moveTableRow as baseMoveTableRow,
    removeColumn as baseRemoveColumn,
    removeRow as baseRemoveRow,
    selectedRect as baseSelectedRect,
    selectionCell as baseSelectionCell,
    setCellAttr as baseSetCellAttr,
    splitCell as baseSplitCell,
    splitCellWithType as baseSplitCellWithType,
    tableEditing as baseTableEditing,
    TableMap,
    toggleHeader as baseToggleHeader,
    toggleHeaderCell as baseToggleHeaderCell,
    toggleHeaderColumn as baseToggleHeaderColumn,
    toggleHeaderRow as baseToggleHeaderRow,
} from '@type-editor/tables';
import type {
    NodeType,
    PmNode,
    ResolvedPos,
    Slice,
} from '@type-editor-compat/model';
import type {
    EditorState as BaseEditorState,
    Plugin as BasePlugin,
    PluginKey as BasePluginKey,
    Selection as BaseSelection,
    Transaction as BaseTransaction,
} from '@type-editor-compat/state';
import type {EditorView, NodeView} from '@type-editor-compat/view';

// Define concrete types locally
export type EditorState = BaseEditorState;
export type Transaction = BaseTransaction;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Plugin<T = any> = BasePlugin<T>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PluginKey<T = any> = BasePluginKey<T>;
export type Selection = BaseSelection;

// Forward declare EditorView
// export interface EditorView {
//     readonly state: EditorState;
//     readonly dom: HTMLElement;
//     dispatch(tr: Transaction): void;
//     [key: string]: unknown;
// }

// ============================================================================
// Compat Types - Define locally since not exported from base module
// ============================================================================

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

/**
 * Options for moveTableColumn command.
 */
export interface MoveTableColumnOptions {
    /** The source column index to move from */
    from: number;
    /** The destination column index to move to */
    to: number;
    /** Whether to select the moved column after the operation. @default true */
    select?: boolean;
    /** Optional position to resolve table from. If not provided, uses the current selection */
    pos?: number;
}

/**
 * Options for moveTableRow command.
 */
export interface MoveTableRowOptions {
    /** The source row index to move from */
    from: number;
    /** The destination row index to move to */
    to: number;
    /** Whether to select the moved row after the operation. @default true */
    select?: boolean;
    /** Optional position to resolve table from. If not provided, uses the current selection */
    pos?: number;
}

/**
 * Type of header to toggle: column header, row header, or individual cell.
 */
export type ToggleHeaderType = 'column' | 'row' | 'cell';

/**
 * Configuration options for the toggleHeader command.
 */
export interface ToggleHeaderOptions {
    /** If true, toggles the selected row/column instead of the first one. Only applies when type is 'row' or 'column'. */
    useSelectedRowColumn?: boolean;
}

// ============================================================================
// CellBookmark - Compat interface using ResolvedPos / PmNode
// ============================================================================

/**
 * A bookmark for a CellSelection that survives document changes.
 * Uses ResolvedPos and PmNode instead of the base types.
 */
export interface CompatCellBookmarkInstance {
    /**
     * Maps this bookmark through a document transformation.
     */
    map(mapping: Mappable): CompatCellBookmarkInstance;

    /**
     * Resolves this bookmark to a CellSelection (or fallback Selection) in the given document.
     */
    resolve(doc: PmNode): CompatCellSelectionInstance | BaseSelection;
}

export interface CompatCellBookmarkConstructor {
    // eslint-disable-next-line @typescript-eslint/prefer-function-type
    new(anchor: number, head: number): CompatCellBookmarkInstance;
}

// ============================================================================
// CellSelection - Compat interface using ResolvedPos / PmNode
// ============================================================================

/**
 * Compat instance interface for CellSelection.
 * All ResolvedPos / PmNode / Slice references use the compat types.
 */
export interface CompatCellSelectionInstance extends Omit<BaseSelection, '$anchorCell' | '$headCell' | 'map' | 'content' | 'replace' | 'replaceWith' | 'getBookmark' | 'forEachCell'> {
    /** The resolved position of the anchor cell. */
    readonly $anchorCell: ResolvedPos;
    /** The resolved position of the head cell. */
    readonly $headCell: ResolvedPos;

    /** Maps the selection through a document change. */
    map(doc: PmNode, mapping: Mappable): CompatCellSelectionInstance | BaseSelection;

    /** Returns a slice containing the selected table cells. */
    content(): Slice;

    /** Replaces the content of all selected cells. */
    replace(transaction: Transaction, content?: Slice): void;

    /** Replaces all selected cells with the given node. */
    replaceWith(transaction: Transaction, node: PmNode): void;

    /** Returns a bookmark that can recreate this selection. */
    getBookmark(): CompatCellBookmarkInstance;

    /**
     * Iterates over every cell in the selection, calling the callback with each cell
     * node and its absolute document position.
     */
    forEachCell(callbackFunc: (node: PmNode, pos: number) => void): void;

    /** Returns true if the selection spans entire columns. */
    isColSelection(): boolean;

    /** Returns true if the selection spans entire rows. */
    isRowSelection(): boolean;
}

export interface CompatCellSelectionConstructor {
    // ---- Constructor --------------------------------------------------------
    new($anchorCell: ResolvedPos, $headCell?: ResolvedPos): CompatCellSelectionInstance;

    readonly prototype: CompatCellSelectionInstance;

    // ---- CellSelection own static methods -----------------------------------

    /** Creates the smallest column selection covering the given anchor and head cells. */
    colSelection($anchorCell: ResolvedPos, $headCell?: ResolvedPos): CompatCellSelectionInstance;

    /** Creates the smallest row selection covering the given anchor and head cells. */
    rowSelection($anchorCell: ResolvedPos, $headCell?: ResolvedPos): CompatCellSelectionInstance;

    /** Creates a CellSelection from a JSON representation. */
    fromJSON(doc: PmNode, json: import('@type-editor/tables').CellSelectionJSON): CompatCellSelectionInstance;

    /** Factory method to create a CellSelection from anchor and head cell positions. */
    create(doc: PmNode, anchorCell: number, headCell?: number): CompatCellSelectionInstance;

    // ---- Inherited static methods from Selection ----------------------------

    /**
     * Find a valid cursor or leaf-node selection starting at the given
     * position and moving in the given direction. When `textOnly` is true,
     * only consider cursor selections.
     */
    near($pos: ResolvedPos, bias?: number): CompatCellSelectionInstance | Selection;

    /** Find a valid selection at the start of the given document. */
    atStart(doc: PmNode): CompatCellSelectionInstance | Selection;

    /** Find a valid selection at the end of the given document. */
    atEnd(doc: PmNode): CompatCellSelectionInstance | Selection;

    /**
     * Find a valid selection starting from the given position and moving
     * in the given direction. Returns null if no valid selection is found.
     */
    findFrom($pos: ResolvedPos, dir: number, textOnly?: boolean): CompatCellSelectionInstance | Selection | null;

    /**
     * Create a selection that covers the content between the given anchor
     * and head positions. Use the `bias` parameter to prefer text selections
     * over node selections (positive = towards the end of the selection).
     */
    between($anchor: ResolvedPos, $head: ResolvedPos, bias?: number): CompatCellSelectionInstance | Selection;

    /** Checks whether the given node type can be selected as a node selection. */
    isNodeSelectable(node: PmNode): boolean;

    /**
     * Register a selection class for JSON deserialization under the given ID.
     * @deprecated Use `registerJsonDeserializerClass` instead.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jsonID(jsonId: string, jsonDeserializerClass: any): void;

    /** Register a selection class for JSON deserialization under the given ID. */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    registerJsonDeserializerClass(jsonId: string, jsonDeserializerClass: any): void;
}

/**
 * Configuration options for the column resizing plugin.
 * This is the compat version that uses EditorView from @type-editor-compat/view.
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
     * Uses EditorView from @type-editor-compat/view.
     * @default TableView
     */
    View?:
        | (new (node: PmNode, cellMinWidth: number, view: EditorView) => NodeView)
        | null;
}

// ============================================================================
// Command Type - Concrete type signature
// ============================================================================

/**
 * Command function type with concrete class references.
 * Uses EditorState and Transaction from compat module instead of Pm* interfaces.
 */
export type Command = (
    state: EditorState,
    dispatch?: (tr: Transaction) => void,
    view?: EditorView
) => boolean;

/**
 * Dispatch function type with compat Transaction.
 */
export type DispatchFunction = (tr: Transaction) => void;

// ============================================================================
// Function Types - Concrete type signatures
// ============================================================================

/**
 * Type for functions that check editor state.
 */
type StateCheckerFunction = (state: EditorState) => boolean;

/**
 * Type for selectedRect function with compat types.
 */
type SelectedRectFunction = (state: EditorState) => TableRect;

/**
 * Type for selectionCell function with compat types.
 */
type SelectionCellFunction = (state: EditorState) => ResolvedPos;

/**
 * Type for fixTables function with compat types.
 */
type FixTablesFunction = (state: EditorState, oldState?: EditorState) => Transaction | undefined;

/**
 * Type for addColumn function with compat types.
 */
type AddColumnFunction = (transaction: Transaction, tableRect: TableRect, column: number) => Transaction;

/**
 * Type for removeColumn function with compat types.
 */
type RemoveColumnFunction = (transaction: Transaction, tableRect: TableRect, column: number) => void;

/**
 * Type for addRow function with compat types.
 */
type AddRowFunction = (transaction: Transaction, tableRect: TableRect, row: number) => Transaction;

/**
 * Type for removeRow function with compat types.
 */
type RemoveRowFunction = (transaction: Transaction, tableRect: TableRect, row: number) => void;

/**
 * Type for goToNextCell factory with compat types.
 */
type GoToNextCellFactory = (direction: Direction) => Command;

/**
 * Type for setCellAttr factory with compat types.
 */
type SetCellAttrFactory = (name: string, value: unknown) => Command;

/**
 * Type for splitCellWithType factory with compat types.
 */
type SplitCellWithTypeFactory = (getCellType: (options: GetCellTypeOptions) => NodeType) => Command;

/**
 * Type for moveTableColumn factory with compat types.
 */
type MoveTableColumnFactory = (options: MoveTableColumnOptions) => Command;

/**
 * Type for moveTableRow factory with compat types.
 */
type MoveTableRowFactory = (options: MoveTableRowOptions) => Command;

/**
 * Type for toggleHeader factory with compat types.
 */
type ToggleHeaderFactory = (type: ToggleHeaderType, options?: ToggleHeaderOptions) => Command;

type TableEditingFactory = (options?: {allowTableNodeSelection?: boolean}) => Plugin;
type ColumnResizingFactory = (columnResizingOptions: ColumnResizingOptions) => Plugin;

// ============================================================================
// Re-export types that don't need modification
// ============================================================================

export type {
    CellAttributes,
    CellSelectionJSON,
    ColWidths,
    Direction,
    Dragging,
    FindNodeResult,
    MutableAttrs,
    Problem,
    Rect,
    TableEditingOptions,
    TableNodes,
    TableNodesOptions,
    TableRole,
} from '@type-editor/tables';

// ============================================================================
// Re-export classes and values that don't need type modifications
// ============================================================================

export {
    addColSpan,
    cellAround,
    cellNear,
    colCount,
    columnIsHeader,
    columnResizingPluginKey,
    findCell,
    findCellPos,
    findCellRange,
    findTable,
    fixTablesKey,
    fixTablesPluginKey,
    handlePaste,
    inSameTable,
    isCellSelection,
    moveCellForward,
    nextCell,
    pointsAtCell,
    removeColSpan,
    ResizeState,
    rowIsHeader,
    tableEditingPluginKey,
    TableMap,
    tableNodes,
    tableNodeTypes,
    TableView,
    updateColumnsOnResize,
} from '@type-editor/tables';

// ============================================================================
// CellBookmark and CellSelection - Re-exported with compat types
// ============================================================================

/**
 * CellBookmark re-exported with compat types.
 * The value is the original CellBookmark class, but the type is the compat constructor interface.
 */
export const CellBookmark: CompatCellBookmarkConstructor = BaseCellBookmark as unknown as CompatCellBookmarkConstructor;
export type CellBookmark = CompatCellBookmarkInstance;

/**
 * CellSelection re-exported with compat types.
 * The value is the original CellSelection class, but the type is the compat constructor interface.
 */
export const CellSelection: CompatCellSelectionConstructor = BaseCellSelection as unknown as CompatCellSelectionConstructor;
export type CellSelection = CompatCellSelectionInstance;

// ============================================================================
// Re-exported Functions with Compat Types
// ============================================================================

// Commands - cast to Command type via 'unknown' to bypass structural incompatibility
export const addColumnAfter: Command = baseAddColumnAfter as unknown as Command;
export const addColumnBefore: Command = baseAddColumnBefore as unknown as Command;
export const addRowAfter: Command = baseAddRowAfter as unknown as Command;
export const addRowBefore: Command = baseAddRowBefore as unknown as Command;
export const deleteCellSelection: Command = baseDeleteCellSelection as unknown as Command;
export const deleteColumn: Command = baseDeleteColumn as unknown as Command;
export const deleteRow: Command = baseDeleteRow as unknown as Command;
export const deleteTable: Command = baseDeleteTable as unknown as Command;
export const mergeCells: Command = baseMergeCells as unknown as Command;
export const splitCell: Command = baseSplitCell as unknown as Command;
export const toggleHeaderCell: Command = baseToggleHeaderCell as unknown as Command;
export const toggleHeaderColumn: Command = baseToggleHeaderColumn as unknown as Command;
export const toggleHeaderRow: Command = baseToggleHeaderRow as unknown as Command;

// Command factories - cast to factory types
export const goToNextCell: GoToNextCellFactory = baseGoToNextCell as unknown as GoToNextCellFactory;
export const setCellAttr: SetCellAttrFactory = baseSetCellAttr as unknown as SetCellAttrFactory;
export const splitCellWithType: SplitCellWithTypeFactory = baseSplitCellWithType as unknown as SplitCellWithTypeFactory;
export const moveTableColumn: MoveTableColumnFactory = baseMoveTableColumn as unknown as MoveTableColumnFactory;
export const moveTableRow: MoveTableRowFactory = baseMoveTableRow as unknown as MoveTableRowFactory;
export const toggleHeader: ToggleHeaderFactory = baseToggleHeader as unknown as ToggleHeaderFactory;

// Functions that take EditorState - cast to compat types
export const isInTable: StateCheckerFunction = baseIsInTable as unknown as StateCheckerFunction;
export const selectedRect: SelectedRectFunction = baseSelectedRect as unknown as SelectedRectFunction;
export const selectionCell: SelectionCellFunction = baseSelectionCell as unknown as SelectionCellFunction;
export const fixTables: FixTablesFunction = baseFixTables as unknown as FixTablesFunction;

// Functions that take Transaction - cast to compat types
export const addColumn: AddColumnFunction = baseAddColumn as unknown as AddColumnFunction;
export const removeColumn: RemoveColumnFunction = baseRemoveColumn as unknown as RemoveColumnFunction;
export const addRow: AddRowFunction = baseAddRow as unknown as AddRowFunction;
export const removeRow: RemoveRowFunction = baseRemoveRow as unknown as RemoveRowFunction;

export const tableEditing: TableEditingFactory = baseTableEditing as unknown as TableEditingFactory;
export const columnResizing: ColumnResizingFactory = baseColumnResizing as unknown as ColumnResizingFactory;

// ============================================================================
// Column Resizing Plugin with Compat Types
// ============================================================================

/**
 * Creates a plugin that allows users to resize table columns by dragging the edges
 * of column cells. The plugin provides visual feedback via decorations and updates
 * the column width attributes in the document.
 *
 * This is the compat version that uses EditorView and Plugin from @type-editor-compat modules.
 *
 * @param columnResizingOptions - Configuration options for the column resizing behavior.
 * @returns A ProseMirror-compatible plugin that handles column resizing.
 *
 * @example
 * ```typescript
 * const plugins = [
 *   columnResizing({
 *     handleWidth: 5,
 *     cellMinWidth: 25,
 *     lastColumnResizable: true,
 *   }),
 *   // ... other plugins
 * ];
 * ```
 */
// export function columnResizing(columnResizingOptions: ColumnResizingOptions = {}): Plugin {
//     return baseColumnResizing(columnResizingOptions as unknown as Parameters<typeof baseColumnResizing>[0]) as unknown as Plugin;
// }


