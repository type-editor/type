[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / utils/query

# utils/query

Query utilities for table cell and table node lookups.

This module provides helper functions for finding and resolving table-related
positions within the editor document. It includes utilities for:

- Finding cells by position
- Finding table nodes containing a position
- Finding cell ranges for selections

## Interfaces

<table>
<thead>
<tr>
<th>Interface</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[FindNodeResult](interfaces/FindNodeResult.md)

</td>
<td>

Result of finding a parent node that matches a predicate.

This interface provides comprehensive information about a found node,
including its position in the document and its depth in the node tree.

</td>
</tr>
</tbody>
</table>

## Functions

<table>
<thead>
<tr>
<th>Function</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[findCellPos](functions/findCellPos.md)

</td>
<td>

Finds the resolved position of a table cell at or near the given document position.

This function first attempts to find a cell that directly contains the position
using [cellAround](../cell-around/functions/cellAround.md). If no containing cell is found, it searches for a
nearby cell using [cellNear](../cell-near/functions/cellNear.md).

**Example**

```typescript
const $cell = findCellPos(state.doc, clickPosition);
if ($cell) {
  console.log("Found cell at position:", $cell.pos);
  console.log("Cell node:", $cell.nodeAfter);
}
```

</td>
</tr>
<tr>
<td>

[findCellRange](functions/findCellRange.md)

</td>
<td>

Finds the anchor and head cell positions for a table cell selection.

This function attempts to determine the cell range for a selection using the following strategy:

1. If no hit points are provided and the selection is already a [CellSelection](../../cellselection/CellSelection/classes/CellSelection.md),
   returns the existing anchor and head cells.
2. Otherwise, uses the provided hit points (or falls back to the selection's anchor/head)
   to find the corresponding cells.
3. Validates that both cells are in the same table before returning.

**Example**

```typescript
// Get cell range from existing cell selection
const range = findCellRange(state.selection);

// Get cell range using specific hit points
const range = findCellRange(state.selection, mouseDownPos, mouseMovePos);

if (range) {
  const [$anchorCell, $headCell] = range;
  // Create a new cell selection...
}
```

</td>
</tr>
<tr>
<td>

[findTable](functions/findTable.md)

</td>
<td>

Finds the closest table node containing the given position.

This function traverses up the document tree from the resolved position
to find the nearest ancestor node with a `tableRole` of `'table'` in its spec.

**Example**

```typescript
const tableResult = findTable(state.selection.$from);
if (tableResult) {
  console.log("Table found at position:", tableResult.pos);
  console.log("Table has", tableResult.node.childCount, "rows");
}
```

</td>
</tr>
<tr>
<td>

[isCellSelection](functions/isCellSelection.md)

</td>
<td>

Type guard to check if a value is a [CellSelection](../../cellselection/CellSelection/classes/CellSelection.md) instance.

This function safely determines whether an unknown value is a cell selection,
enabling type-safe access to cell selection properties and methods.

**Example**

```typescript
if (isCellSelection(editor.state.selection)) {
  const anchorCell = editor.state.selection.$anchorCell;
  const headCell = editor.state.selection.$headCell;
}
```

</td>
</tr>
</tbody>
</table>
