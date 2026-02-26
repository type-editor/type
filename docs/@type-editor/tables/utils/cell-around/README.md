[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / utils/cell-around

# utils/cell-around

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

[cellAround](functions/cellAround.md)

</td>
<td>

Finds the resolved position of the cell containing the given position.

This function walks up the document tree from the given position to find
the nearest cell boundary. It returns a resolved position pointing to the
start of the cell node.

**Example**

```typescript
const $cell = cellAround(state.selection.$head);
if ($cell) {
  console.log("Cursor is in cell at position:", $cell.pos);
}
```

</td>
</tr>
</tbody>
</table>
