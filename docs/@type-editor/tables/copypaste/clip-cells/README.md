[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / copypaste/clip-cells

# copypaste/clip-cells

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

[clipCells](functions/clipCells.md)

</td>
<td>

Clips or extends (repeats) a set of cells to cover the given dimensions.

This function adjusts the cell area to match the target width and height:

- If the area is smaller, cells are repeated to fill the space
- If the area is larger, cells are clipped
- Cells with rowspan/colspan that extend beyond boundaries are trimmed

**Example**

```typescript
// Clip a 3x3 area to 2x2
const clipped = clipCells(originalArea, 2, 2);

// Extend a 2x2 area to 4x4 by repeating
const extended = clipCells(originalArea, 4, 4);
```

</td>
</tr>
</tbody>
</table>
