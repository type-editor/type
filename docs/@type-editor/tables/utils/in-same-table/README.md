[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / utils/in-same-table

# utils/in-same-table

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

[inSameTable](functions/inSameTable.md)

</td>
<td>

Checks if two cell positions are within the same table.

Two cells are considered to be in the same table if they have the same
depth and the first cell's position is within the bounds of the second
cell's parent table.

**Example**

```typescript
if (inSameTable($anchorCell, $headCell)) {
  // Create a cell selection spanning these cells
}
```

</td>
</tr>
</tbody>
</table>
