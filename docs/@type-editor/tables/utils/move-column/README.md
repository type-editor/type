[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / utils/move-column

# utils/move-column

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

[MoveColumnParams](interfaces/MoveColumnParams.md)

</td>
<td>

Parameters for moving a column within a table.

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

[moveColumn](functions/moveColumn.md)

</td>
<td>

Moves a column from the origin index to the target index within a table.

This function handles column movement by:

1. Finding the table at the given position
2. Determining the full range of columns to move (accounting for merged cells)
3. Performing the move operation by transposing the table, moving rows, and transposing back
4. Optionally selecting the moved column

</td>
</tr>
</tbody>
</table>
