[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/state](../../README.md) / selection/Selection

# selection/Selection

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

[Selection](classes/Selection.md)

</td>
<td>

Superclass for editor selections. Every selection type should
extend this. Should not be instantiated directly.

This abstract class provides the foundation for all selection types in the editor,
including text selections, node selections, and all-document selections.
It manages the selection's anchor, head, and ranges, along with methods to
query and manipulate the selection state.

Note: made this class non-abstract due to issues with the compat module.

</td>
</tr>
</tbody>
</table>

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

[JSONToSelectionDeserializer](interfaces/JSONToSelectionDeserializer.md)

</td>
<td>

&hyphen;

</td>
</tr>
</tbody>
</table>
