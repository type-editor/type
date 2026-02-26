[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / utils/next-cell

# utils/next-cell

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

[nextCell](functions/nextCell.md)

</td>
<td>

Finds the next cell in a given direction along an axis.

Navigates from the current cell position to find an adjacent cell,
properly handling cells that span multiple rows or columns.

**Example**

```typescript
const nextRight = nextCell($cellPos, "horiz", 1);
const nextUp = nextCell($cellPos, "vert", -1);
```

</td>
</tr>
</tbody>
</table>
