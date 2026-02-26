[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/state](../../README.md) / selection/NodeSelection

# selection/NodeSelection

## Classes

<table>
<thead>
<tr>
<th>Class</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[NodeSelection](classes/NodeSelection.md)

</td>
<td>

A node selection is a selection that points at a single node. All
nodes marked [selectable](#model.NodeSpec.selectable) can be the
target of a node selection. In such a selection, `from` and `to`
point directly before and after the selected node, `anchor` equals
`from`, and `head` equals `to`.

Node selections are typically invisible and are used to select
block-level elements like images, tables, or other atomic nodes
that cannot be part of a text selection.

</td>
</tr>
</tbody>
</table>
