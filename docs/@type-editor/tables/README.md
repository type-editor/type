[**Type Editor**](../../README.md)

---

[Type Editor](../../index.md) / @type-editor/tables

# @type-editor/tables

This is a refactored version of the [prosemirror-tables](https://github.com/ProseMirror/prosemirror-dropcursor) module.

This module defines a schema extension to support tables with
rowspan/colspan support, a custom selection class for cell selections
in such a table, a plugin to manage such selections and enforce
invariants on such tables, and a number of commands to work with
tables.

The `demo` directory contains `index.html`, which
can be built with `pnpm run build_demo` to show a simple demo of how the
module can be used.

## [Live Demo](https://prosemirror-tables.netlify.app/)

## Documentation

The module's main file exports everything you need to work with it.
The first thing you'll probably want to do is create a table-enabled
schema. That's what `tableNodes` is for:

- **`tableNodes`**`(options: Object) → Object`\
  This function creates a set of [node
  specs](http://prosemirror.net/docs/ref/#model.SchemaSpec.nodes) for
  `table`, `table_row`, and `table_cell` nodes types as used by this
  module. The result can then be added to the set of nodes when
  creating a a schema.
  - **`options`**`: Object`\
    The following options are understood:
    - **`tableGroup`**`: ?string`\
      A group name (something like `"block"`) to add to the table
      node type.

    - **`cellContent`**`: string`\
      The content expression for table cells.

    - **`cellAttributes`**`: ?Object`\
      Additional attributes to add to cells. Maps attribute names to
      objects with the following properties:
      - **`default`**`: any`\
        The attribute's default value.

      - **`getFromDOM`**`: ?fn(dom.Node) → any`\
        A function to read the attribute's value from a DOM node.

      - **`setDOMAttr`**`: ?fn(value: any, attrs: Object)`\
        A function to add the attribute's value to an attribute
        object that's used to render the cell's DOM.

- **`tableEditing`**`() → Plugin`\
  Creates a [plugin](http://prosemirror.net/docs/ref/#state.Plugin)
  that, when added to an editor, enables cell-selection, handles
  cell-based copy/paste, and makes sure tables stay well-formed (each
  row has the same width, and cells don't overlap).

  You should probably put this plugin near the end of your array of
  plugins, since it handles mouse and arrow key events in tables
  rather broadly, and other plugins, like the gap cursor or the
  column-width dragging plugin, might want to get a turn first to
  perform more specific behavior.

### class CellSelection extends Selection

A [`Selection`](http://prosemirror.net/docs/ref/#state.Selection)
subclass that represents a cell selection spanning part of a table.
With the plugin enabled, these will be created when the user
selects across cells, and will be drawn by giving selected cells a
`selectedCell` CSS class.

- `new `**`CellSelection`**`($anchorCell: ResolvedPos, $headCell: ?ResolvedPos = $anchorCell)`\
  A table selection is identified by its anchor and head cells. The
  positions given to this constructor should point _before_ two
  cells in the same table. They may be the same, to select a single
  cell.

- **`$anchorCell`**`: ResolvedPos`\
  A resolved position pointing _in front of_ the anchor cell (the one
  that doesn't move when extending the selection).

- **`$headCell`**`: ResolvedPos`\
  A resolved position pointing in front of the head cell (the one
  moves when extending the selection).

- **`content`**`() → Slice`\
  Returns a rectangular slice of table rows containing the selected
  cells.

- **`isColSelection`**`() → bool`\
  True if this selection goes all the way from the top to the
  bottom of the table.

- **`isRowSelection`**`() → bool`\
  True if this selection goes all the way from the left to the
  right of the table.

- `static `**`colSelection`**`($anchorCell: ResolvedPos, $headCell: ?ResolvedPos = $anchorCell) → CellSelection`\
  Returns the smallest column selection that covers the given anchor
  and head cell.

- `static `**`rowSelection`**`($anchorCell: ResolvedPos, $headCell: ?ResolvedPos = $anchorCell) → CellSelection`\
  Returns the smallest row selection that covers the given anchor
  and head cell.

- `static `**`create`**`(doc: Node, anchorCell: number, headCell: ?number = anchorCell) → CellSelection`

### Commands

The following commands can be used to make table-editing functionality
available to users.

- **`addColumnBefore`**`(state: EditorState, dispatch: ?fn(tr: Transaction)) → bool`\
  Command to add a column before the column with the selection.

- **`addColumnAfter`**`(state: EditorState, dispatch: ?fn(tr: Transaction)) → bool`\
  Command to add a column after the column with the selection.

- **`deleteColumn`**`(state: EditorState, dispatch: ?fn(tr: Transaction)) → bool`\
  Command function that removes the selected columns from a table.

- **`addRowBefore`**`(state: EditorState, dispatch: ?fn(tr: Transaction)) → bool`\
  Add a table row before the selection.

- **`addRowAfter`**`(state: EditorState, dispatch: ?fn(tr: Transaction)) → bool`\
  Add a table row after the selection.

- **`deleteRow`**`(state: EditorState, dispatch: ?fn(tr: Transaction)) → bool`\
  Remove the selected rows from a table.

- **`mergeCells`**`(state: EditorState, dispatch: ?fn(tr: Transaction)) → bool`\
  Merge the selected cells into a single cell. Only available when
  the selected cells' outline forms a rectangle.

- **`splitCell`**`(state: EditorState, dispatch: ?fn(tr: Transaction)) → bool`\
  Split a selected cell, whose rowpan or colspan is greater than one,
  into smaller cells. Use the first cell type for the new cells.

- **`splitCellWithType`**`(getType: fn({row: number, col: number, node: Node}) → NodeType) → fn(EditorState, dispatch: ?fn(tr: Transaction)) → bool`\
  Split a selected cell, whose rowpan or colspan is greater than one,
  into smaller cells with the cell type (th, td) returned by getType function.

- **`setCellAttr`**`(name: string, value: any) → fn(EditorState, dispatch: ?fn(tr: Transaction)) → bool`\
  Returns a command that sets the given attribute to the given value,
  and is only available when the currently selected cell doesn't
  already have that attribute set to that value.

- **`toggleHeaderRow`**`(EditorState, dispatch: ?fn(tr: Transaction)) → bool`\
  Toggles whether the selected row contains header cells.

- **`toggleHeaderColumn`**`(EditorState, dispatch: ?fn(tr: Transaction)) → bool`\
  Toggles whether the selected column contains header cells.

- **`toggleHeaderCell`**`(EditorState, dispatch: ?fn(tr: Transaction)) → bool`\
  Toggles whether the selected cells are header cells.

- **`toggleHeader`**`(type: string, options: ?{useDeprecatedLogic: bool}) → fn(EditorState, dispatch: ?fn(tr: Transaction)) → bool`\
  Toggles between row/column header and normal cells (Only applies to first row/column).
  For deprecated behavior pass `useDeprecatedLogic` in options with true.

- **`goToNextCell`**`(direction: number) → fn(EditorState, dispatch: ?fn(tr: Transaction)) → bool`\
  Returns a command for selecting the next (direction=1) or previous
  (direction=-1) cell in a table.

- **`deleteTable`**`(state: EditorState, dispatch: ?fn(tr: Transaction)) → bool`\
  Deletes the table around the selection, if any.

- **`moveTableRow`**`(options: MoveTableRowOptions) → fn(EditorState, dispatch: ?fn(tr: Transaction)) → bool`\
  Move a table row from one index to another.

- **`moveTableColumn`**`(options: MoveTableColumnOptions) → fn(EditorState, dispatch: ?fn(tr: Transaction)) → bool`\
  Move a table column from one index to another.

### Utilities

- **`fixTables`**`(state: EditorState, oldState: ?EditorState) → ?Transaction`\
  Inspect all tables in the given state's document and return a
  transaction that fixes them, if necessary. If `oldState` was
  provided, that is assumed to hold a previous, known-good state,
  which will be used to avoid re-scanning unchanged parts of the
  document.

- **`findTable`**`($pos: ResolvedPos) → ?FindNodeResult`\
  Find the closest table node that contains the given position, if any.

- **`findCellRange`**`($pos: ResolvedPos, anchorHit: ?number, headHit: ?number) → ?[ResolvedPos, ResolvedPos]`\
  Find the anchor and head cell in the same table by using the given position and optional hit positions, or fallback to the selection's anchor and head.

- **`findCellPos`**`(doc: Node, pos: number) → ?ResolvedPos`\
  Find a resolved pos of a cell by using the given position as a hit point.

### class TableMap

A table map describes the structore of a given table. To avoid
recomputing them all the time, they are cached per table node. To
be able to do that, positions saved in the map are relative to the
start of the table, rather than the start of the document.

- **`width`**`: number`\
  The width of the table

- **`height`**`: number`\
  The table's height

- **`map`**`: [number]`\
  A width \* height array with the start position of
  the cell covering that part of the table in each slot

- **`findCell`**`(pos: number) → Rect`\
  Find the dimensions of the cell at the given position.

- **`colCount`**`(pos: number) → number`\
  Find the left side of the cell at the given position.

- **`nextCell`**`(pos: number, axis: string, dir: number) → ?number`\
  Find the next cell in the given direction, starting from the cell
  at `pos`, if any.

- **`rectBetween`**`(a: number, b: number) → Rect`\
  Get the rectangle spanning the two given cells.

- **`cellsInRect`**`(rect: Rect) → [number]`\
  Return the position of all cells that have the top left corner in
  the given rectangle.

- **`positionAt`**`(row: number, col: number, table: Node) → number`\
  Return the position at which the cell at the given row and column
  starts, or would start, if a cell started there.

- `static `**`get`**`(table: Node) → TableMap`\
  Find the table map for the given table node.

## Modules

<table>
<thead>
<tr>
<th>Module</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[cellselection/CellBookmark](cellselection/CellBookmark/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[cellselection/CellSelection](cellselection/CellSelection/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[cellselection/draw-cell-selection](cellselection/draw-cell-selection/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[cellselection/normalize-selection](cellselection/normalize-selection/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[columnresizing/column-resizing](columnresizing/column-resizing/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[columnresizing/column-resizing-plugin-key](columnresizing/column-resizing-plugin-key/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[columnresizing/column-resizing/handle-decorations](columnresizing/column-resizing/handle-decorations/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[columnresizing/column-resizing/handle-mouse-down](columnresizing/column-resizing/handle-mouse-down/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[columnresizing/column-resizing/handle-mouse-leave](columnresizing/column-resizing/handle-mouse-leave/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[columnresizing/column-resizing/handle-mouse-move](columnresizing/column-resizing/handle-mouse-move/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[columnresizing/column-resizing/util/get-rightmost-column](columnresizing/column-resizing/util/get-rightmost-column/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[columnresizing/column-resizing/util/update-handle](columnresizing/column-resizing/util/update-handle/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[columnresizing/no-active-handle](columnresizing/no-active-handle/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[columnresizing/ResizeState](columnresizing/ResizeState/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/add-column](commands/add-column/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/add-column-after](commands/add-column-after/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/add-column-before](commands/add-column-before/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/add-row](commands/add-row/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/add-row-after](commands/add-row-after/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/add-row-before](commands/add-row-before/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/delete-cell-selection](commands/delete-cell-selection/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/delete-column](commands/delete-column/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/delete-row](commands/delete-row/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/delete-table](commands/delete-table/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/go-to-next-cell](commands/go-to-next-cell/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/merge-cells](commands/merge-cells/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/move-table-column](commands/move-table-column/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/move-table-row](commands/move-table-row/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/remove-column](commands/remove-column/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/remove-row](commands/remove-row/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/row-is-header](commands/row-is-header/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/selected-rect](commands/selected-rect/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/set-cell-attr](commands/set-cell-attr/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/split-cell](commands/split-cell/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/split-cell-with-type](commands/split-cell-with-type/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/toggle-header](commands/toggle-header/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/toggle-header-cell](commands/toggle-header-cell/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/toggle-header-column](commands/toggle-header-column/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/toggle-header-row](commands/toggle-header-row/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[copypaste/clip-cells](copypaste/clip-cells/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[copypaste/fit-slice](copypaste/fit-slice/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[copypaste/insert-cells](copypaste/insert-cells/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[copypaste/pasted-cells](copypaste/pasted-cells/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[fix-tables-plugin-key](fix-tables-plugin-key/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[fixtables/fix-table](fixtables/fix-table/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[fixtables/fix-tables](fixtables/fix-tables/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input/arrow](input/arrow/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input/escape-table-down](input/escape-table-down/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input/handle-key-down](input/handle-key-down/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input/handle-mouse-down](input/handle-mouse-down/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input/handle-paste](input/handle-paste/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input/handle-triple-click](input/handle-triple-click/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input/util/at-end-of-cell](input/util/at-end-of-cell/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input/util/maybe-set-selection](input/util/maybe-set-selection/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[schema](schema/README.md)

</td>
<td>

Helper utilities for creating a ProseMirror schema that supports tables.

This module provides functions to generate node specifications for table-related
nodes (table, row, cell, header) and utilities for working with table node types.

</td>
</tr>
<tr>
<td>

[table-editing-plugin](table-editing-plugin/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[table-editing-plugin-key](table-editing-plugin-key/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[tablemap/compute-map](tablemap/compute-map/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[tablemap/StandardTableMapCache](tablemap/StandardTableMapCache/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[tablemap/TableMap](tablemap/TableMap/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[tableview/TableView](tableview/TableView/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[tableview/update-columns-on-resize](tableview/update-columns-on-resize/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/CellAttrs](types/CellAttrs/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/cellselection/CellSelectionJSON](types/cellselection/CellSelectionJSON/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/columnresizing/ColumnResizingOptions](types/columnresizing/ColumnResizingOptions/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/columnresizing/Dragging](types/columnresizing/Dragging/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/commands/GetCellTypeOptions](types/commands/GetCellTypeOptions/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/commands/MoveTableColumnOptions](types/commands/MoveTableColumnOptions/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/commands/MoveTableRowOptions](types/commands/MoveTableRowOptions/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/commands/TableRect](types/commands/TableRect/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/commands/ToggleHeaderOptions](types/commands/ToggleHeaderOptions/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/commands/ToggleHeaderType](types/commands/ToggleHeaderType/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/copypaste/Area](types/copypaste/Area/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/input/Axis](types/input/Axis/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/input/Direction](types/input/Direction/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/MutableAttrs](types/MutableAttrs/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/TableEditingOptions](types/TableEditingOptions/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/tablemap/ColWidths](types/tablemap/ColWidths/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/tablemap/Problem](types/tablemap/Problem/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/tablemap/Rect](types/tablemap/Rect/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/tablemap/TableMapCache](types/tablemap/TableMapCache/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[utils/add-col-span](utils/add-col-span/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[utils/cell-around](utils/cell-around/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[utils/cell-near](utils/cell-near/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[utils/cell-wrapping](utils/cell-wrapping/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[utils/col-count](utils/col-count/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[utils/column-is-header](utils/column-is-header/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[utils/convert](utils/convert/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[utils/find-cell](utils/find-cell/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[utils/get-cells](utils/get-cells/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[utils/helper/has-table-cell-role](utils/helper/has-table-cell-role/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[utils/in-same-table](utils/in-same-table/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[utils/is-in-table](utils/is-in-table/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[utils/move-cell-forward](utils/move-cell-forward/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[utils/move-column](utils/move-column/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[utils/move-row](utils/move-row/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[utils/move-row-in-array-of-rows](utils/move-row-in-array-of-rows/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[utils/next-cell](utils/next-cell/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[utils/points-at-cell](utils/points-at-cell/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[utils/query](utils/query/README.md)

</td>
<td>

Query utilities for table cell and table node lookups.

This module provides helper functions for finding and resolving table-related
positions within the editor document. It includes utilities for:

- Finding cells by position
- Finding table nodes containing a position
- Finding cell ranges for selections

</td>
</tr>
<tr>
<td>

[utils/remove-col-span](utils/remove-col-span/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[utils/selection-cell](utils/selection-cell/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[utils/selection-range](utils/selection-range/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[utils/transpose](utils/transpose/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
</tbody>
</table>
