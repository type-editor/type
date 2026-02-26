[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / utils/points-at-cell

# utils/points-at-cell

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

[pointsAtCell](functions/pointsAtCell.md)

</td>
<td>

Checks if the given position points directly at a cell.

A position "points at" a cell when its parent is a table row
and there is a node immediately after the position.

**Example**

```typescript
if (pointsAtCell($pos)) {
  const cell = $pos.nodeAfter;
  // Process the cell...
}
```

</td>
</tr>
</tbody>
</table>
