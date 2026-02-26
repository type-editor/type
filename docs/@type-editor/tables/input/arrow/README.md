[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / input/arrow

# input/arrow

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

[arrow](functions/arrow.md)

</td>
<td>

Creates a command for arrow key navigation within tables.

When the cursor is within a cell selection, this moves the selection near the head cell.
When at the edge of a cell, it navigates to the adjacent cell.

**Example**

```typescript
// Create a command for moving right
const moveRight = arrow("horiz", 1);
```

</td>
</tr>
</tbody>
</table>
