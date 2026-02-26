[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / utils/move-cell-forward

# utils/move-cell-forward

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

[moveCellForward](functions/moveCellForward.md)

</td>
<td>

Moves a position forward past the current cell.

This function assumes the position points at a cell (see pointsAtCell)
and returns a new resolved position after that cell.

**Example**

```typescript
let $cellPos = getFirstCellPos(table);
while (pointsAtCell($cellPos)) {
  processCell($cellPos.nodeAfter);
  $cellPos = moveCellForward($cellPos);
}
```

</td>
</tr>
</tbody>
</table>
