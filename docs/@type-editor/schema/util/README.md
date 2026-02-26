[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/schema](../README.md) / util

# util

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

[addListNodes](functions/addListNodes.md)

</td>
<td>

Convenience function for adding list-related node types to a map
specifying the nodes for a schema. Adds
[`orderedList`](#schema-list.orderedList) as `'ordered_list'`,
[`bulletList`](#schema-list.bulletList) as `'bullet_list'`, and
[`listItem`](#schema-list.listItem) as `'list_item'`.

`itemContent` determines the content expression for the list items.
If you want the commands defined in this module to apply to your
list structure, it should have a shape like `'paragraph block*'` or
`'paragraph (ordered_list | bullet_list)*'`. `listGroup` can be
given to assign a group name to the list node types, for example
`'block'`.

</td>
</tr>
</tbody>
</table>
