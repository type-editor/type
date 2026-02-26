[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/commands](../README.md) / backspace

# backspace

## Variables

<table>
<thead>
<tr>
<th>Variable</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[backspace](variables/backspace.md)

</td>
<td>

Default command for the backspace key.

This command chains together four operations:

1. Delete the selection if one exists
2. If the cursor is at the start of the first paragraph of a list item, merge
   that paragraph with the last paragraph of the previous list item (inserting a
   space at the boundary) instead of simply joining the two list items as containers
3. Try to join with the block before the cursor
4. Try to select the node before the cursor

</td>
</tr>
</tbody>
</table>
