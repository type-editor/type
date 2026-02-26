[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / utils/convert

# utils/convert

## Type Aliases

<table>
<thead>
<tr>
<th>Type Alias</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[TableCellMatrix](type-aliases/TableCellMatrix.md)

</td>
<td>

A matrix representation of table cells, where each element is either a Node
(for the top-left cell of a merged region) or null (for continuation cells
that are part of a merged cell spanning from above or left).

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

[convertArrayOfRowsToTableNode](functions/convertArrayOfRowsToTableNode.md)

</td>
<td>

Converts a matrix of table cells back into a table node.

This function reconstructs a table node from a 2D array representation,
typically used after modifying the table structure or cell contents.
The matrix should follow the same format produced by [convertTableNodeToArrayOfRows](functions/convertTableNodeToArrayOfRows.md),
where `null` values represent continuation cells of merged regions.

**Example**

```typescript
const originalTable = table(tr(td("A1"), td("B1")), tr(td("A2"), td("B2")));
const matrix = convertTableNodeToArrayOfRows(originalTable);

// Modify a cell in the matrix
matrix[0][0] = createNewCell("Modified A1");

// Convert back to a table node
const newTable = convertArrayOfRowsToTableNode(originalTable, matrix);
```

</td>
</tr>
<tr>
<td>

[convertTableNodeToArrayOfRows](functions/convertTableNodeToArrayOfRows.md)

</td>
<td>

Transforms a table node into a matrix of rows and columns, respecting merged cells.

For cells spanning multiple rows or columns, only the top-left cell of the merged
region contains the actual Node; all other positions in the span are represented
as `null`.

**Example**

Given this table structure:

```
┌──────┬──────┬─────────────┐
│  A1  │  B1  │     C1      │
├──────┼──────┴──────┬──────┤
│  A2  │     B2      │      │
├──────┼─────────────┤  D1  │
│  A3  │  B3  │  C3  │      │
└──────┴──────┴──────┴──────┘
```

The result will be:

```javascript
[
  [A1, B1, C1, null], // C1 spans 2 columns, so position 3 is null
  [A2, B2, null, D1], // B2 spans 2 columns, D1 starts here but spans 2 rows
  [A3, B3, C3, null], // D1 continues from above, so position 3 is null
];
```

</td>
</tr>
</tbody>
</table>
