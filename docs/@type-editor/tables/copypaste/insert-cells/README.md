[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / copypaste/insert-cells

# copypaste/insert-cells

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

[insertCells](functions/insertCells.md)

</td>
<td>

Inserts a rectangular area of cells into a table at a specified position.

This function handles the complete process of pasting cells into a table:

1. Grows the table if necessary to accommodate the pasted cells
2. Splits any cells that span across the insertion boundaries
3. Replaces the cells in the target area with the pasted cells
4. Sets the selection to cover the newly inserted cells

The cells parameter should be obtained from pastedCells, which normalizes
clipboard content into a rectangular area.

**Throws**

If no table is found at the specified position.

**Example**

```typescript
const cells = pastedCells(clipboardSlice);
if (cells) {
  insertCells(
    state,
    dispatch,
    tableStart,
    { left: 0, top: 0, right: 0, bottom: 0 },
    cells,
  );
}
```

</td>
</tr>
</tbody>
</table>
