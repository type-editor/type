[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/schema](../../README.md) / list-commands/lift-entire-list

# list-commands/lift-entire-list

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

[liftEntireList](functions/liftEntireList.md)

</td>
<td>

Lifts an entire list out, unwrapping all list items.

This function creates a NodeRange covering ALL list items in the enclosing list,
then lifts them all out at once. If the list is nested inside another list,
the items become items of the outer list. If it's a top-level list, the items
are unwrapped back to regular blocks.

</td>
</tr>
</tbody>
</table>
