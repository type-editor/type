[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / utils/selection-cell

# utils/selection-cell

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

[selectionCell](functions/selectionCell.md)

</td>
<td>

Gets the resolved position of the "main" cell in the current selection.

For cell selections, returns the position of the cell that is furthest
in document order (comparing anchor and head). For node selections of a cell,
returns the anchor position. For other selections, finds the nearest cell.

**Throws**

RangeError if no cell can be found around the selection.

**Example**

```typescript
try {
  const $cell = selectionCell(state);
  console.log("Selected cell at position:", $cell.pos);
} catch (e) {
  console.log("Not in a table cell");
}
```

</td>
</tr>
</tbody>
</table>
