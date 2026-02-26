[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/schema](../../README.md) / list-commands/sink-list-item

# list-commands/sink-list-item

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

[sinkListItem](functions/sinkListItem.md)

</td>
<td>

Creates a command to sink (indent) the list item around the selection down
into an inner nested list.

This command moves the selected list item(s) into a sublist of the preceding
sibling list item, effectively increasing the indentation level. The command
will fail if:

- There is no valid block range containing list items
- The selected item is the first item (no preceding sibling to nest under)
- The preceding sibling is not a list item of the same type

</td>
</tr>
</tbody>
</table>
