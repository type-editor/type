[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / utils/move-row-in-array-of-rows

# utils/move-row-in-array-of-rows

## Type Aliases

<table>
<thead>
<tr>
<th>Type Alias</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[MoveDirection](type-aliases/MoveDirection.md)

</td>
<td>

Direction indicator for row movement.

- `-1`: Moving backward/upward (toward smaller indexes)
- `0`: Natural direction based on origin/target positions
- `1`: Moving forward/downward (toward larger indexes)

</td>
</tr>
</tbody>
</table>

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

[moveRowInArrayOfRows](functions/moveRowInArrayOfRows.md)

</td>
<td>

Moves one or more consecutive elements from the origin position to a target position
within an array of rows. Supports both single and multi-row operations.

The function handles complex scenarios including:

- Moving a single row up or down
- Moving multiple consecutive rows (e.g., merged cells spanning multiple rows)
- Direction overrides for precise positioning control

**Example**

```typescript
// Moving a single row down
const rows = [0, 1, 2, 3, 4];
moveRowInArrayOfRows(rows, [1], [3], 0);
// Result: [0, 2, 3, 1, 4]

// Moving multiple consecutive rows up
const rows2 = [0, 1, 2, 3, 4, 5];
moveRowInArrayOfRows(rows2, [4, 5], [1, 2], 0);
// Result: [0, 4, 5, 1, 2, 3]
```

</td>
</tr>
</tbody>
</table>
