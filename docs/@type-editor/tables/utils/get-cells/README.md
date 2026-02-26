[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / utils/get-cells

# utils/get-cells

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

[getCellsInColumn](functions/getCellsInColumn.md)

</td>
<td>

Returns an array of cells in a column at the specified column index.

This function locates the table containing the current selection and retrieves
all cells that belong to the specified column. The returned cells include
their positions and node references for further manipulation.

**Example**

```typescript
const cells = getCellsInColumn(0, editorState.selection);
if (cells) {
  cells.forEach((cell) => console.log(cell.node.textContent));
}
```

</td>
</tr>
<tr>
<td>

[getCellsInRow](functions/getCellsInRow.md)

</td>
<td>

Returns an array of cells in a row at the specified row index.

This function locates the table containing the current selection and retrieves
all cells that belong to the specified row. The returned cells include
their positions and node references for further manipulation.

**Example**

```typescript
const cells = getCellsInRow(0, editorState.selection);
if (cells) {
  cells.forEach((cell) => console.log(cell.node.textContent));
}
```

</td>
</tr>
</tbody>
</table>
