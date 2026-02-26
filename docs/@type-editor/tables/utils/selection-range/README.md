[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / utils/selection-range

# utils/selection-range

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

[CellSelectionRange](interfaces/CellSelectionRange.md)

</td>
<td>

Represents a rectangular selection range within a table.

This interface describes the anchor and head positions for a cell selection,
along with the indexes of all columns or rows included in the selection.

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

[getSelectionRangeInColumn](functions/getSelectionRangeInColumn.md)

</td>
<td>

Returns a range of rectangular selection spanning all merged cells around a
column at the specified index.

This function calculates the complete selection range needed to select entire
columns, taking into account cells that span multiple columns. When a cell
spans across the selection boundary, the selection is automatically expanded
to include all columns covered by that cell.

Original implementation from Atlassian (Apache License 2.0)

**See**

https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/5f91cb871e8248bc3bae5ddc30bb9fd9200fadbb/editor/editor-tables/src/utils/get-selection-range-in-column.ts

**Example**

```typescript
// Select a single column
const range = getSelectionRangeInColumn(tr, 2);

// Select multiple columns
const multiRange = getSelectionRangeInColumn(tr, 1, 3);

if (range) {
  const cellSelection = CellSelection.create(
    tr.doc,
    range.$anchor.pos,
    range.$head.pos,
  );
  tr.setSelection(cellSelection);
}
```

</td>
</tr>
<tr>
<td>

[getSelectionRangeInRow](functions/getSelectionRangeInRow.md)

</td>
<td>

Returns a range of rectangular selection spanning all merged cells around a
row at the specified index.

This function calculates the complete selection range needed to select entire
rows, taking into account cells that span multiple rows. When a cell spans
across the selection boundary, the selection is automatically expanded to
include all rows covered by that cell.

Original implementation from Atlassian (Apache License 2.0)

**See**

https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/5f91cb871e8248bc3bae5ddc30bb9fd9200fadbb/editor/editor-tables/src/utils/get-selection-range-in-row.ts

**Example**

```typescript
// Select a single row
const range = getSelectionRangeInRow(tr, 0);

// Select multiple rows
const multiRange = getSelectionRangeInRow(tr, 1, 4);

if (range) {
  const cellSelection = CellSelection.create(
    tr.doc,
    range.$anchor.pos,
    range.$head.pos,
  );
  tr.setSelection(cellSelection);
}
```

</td>
</tr>
</tbody>
</table>
