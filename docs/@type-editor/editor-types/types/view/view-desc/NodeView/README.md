[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/editor-types](../../../../README.md) / types/view/view-desc/NodeView

# types/view/view-desc/NodeView

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

[NodeView](interfaces/NodeView.md)

</td>
<td>

By default, document nodes are rendered using the result of the
[`toDOM`](#model.NodeSpec.toDOM) method of their spec, and managed
entirely by the editor. For some use cases, such as embedded
node-specific editing interfaces, you want more control over
the behavior of a node's in-editor representation, and need to
[define](#view.EditorProps.nodeViews) a custom node view.

Objects returned as node views must conform to this interface.

</td>
</tr>
</tbody>
</table>
