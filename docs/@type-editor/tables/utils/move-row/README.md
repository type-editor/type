[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / utils/move-row

# utils/move-row

## Interfaces

<table>
<thead>
<tr>
<th>Interface</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[MoveRowParams](interfaces/MoveRowParams.md)

</td>
<td>

Parameters for moving a row within a table.

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

[moveRow](functions/moveRow.md)

</td>
<td>

Moves a table row from one position to another within the same table.

This function handles complex scenarios including:

- Moving rows that are part of merged cells (rowspan)
- Preserving cell content and attributes during the move
- Optionally selecting the moved row after the operation

The function will fail (return `false`) if:

- The position is not within a table
- Either the origin or target row cannot be resolved
- The target row is part of the same merged cell group as the origin row

**Example**

```typescript
// Move row at index 2 to position 0 (top of table)
const success = moveRow({
  tr: state.transaction,
  originIndex: 2,
  targetIndex: 0,
  select: true,
  pos: tablePos,
});
```

</td>
</tr>
</tbody>
</table>
