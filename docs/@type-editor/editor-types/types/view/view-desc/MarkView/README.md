[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/editor-types](../../../../README.md) / types/view/view-desc/MarkView

# types/view/view-desc/MarkView

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

[MarkView](interfaces/MarkView.md)

</td>
<td>

By default, document marks are rendered using the result of the
[`toDOM`](#model.MarkSpec.toDOM) method of their spec, and managed entirely
by the editor. For some use cases, you want more control over the behavior
of a mark's in-editor representation, and need to
[define](#view.EditorProps.markViews) a custom mark view.

Objects returned as mark views must conform to this interface.

</td>
</tr>
</tbody>
</table>
