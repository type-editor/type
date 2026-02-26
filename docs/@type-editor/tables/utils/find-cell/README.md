[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / utils/find-cell

# utils/find-cell

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

[findCell](functions/findCell.md)

</td>
<td>

Finds the rectangular bounds of the cell at the given position.

Uses the table map to determine the cell's position in the table grid,
accounting for any rowspan or colspan that may affect its bounds.

**Example**

```typescript
const rect = findCell($cellPos);
console.log(`Cell spans from column ${rect.left} to ${rect.right}`);
```

</td>
</tr>
</tbody>
</table>
