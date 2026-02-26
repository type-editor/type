[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / utils/cell-wrapping

# utils/cell-wrapping

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

[cellWrapping](functions/cellWrapping.md)

</td>
<td>

Finds the cell node that wraps the given position.

Unlike cellAround, this function returns the actual cell node
rather than a resolved position. It checks the current depth and all
ancestor nodes to find a cell.

**Example**

```typescript
const cellNode = cellWrapping(state.selection.$head);
if (cellNode) {
  console.log("Cell colspan:", cellNode.attrs.colspan);
}
```

</td>
</tr>
</tbody>
</table>
