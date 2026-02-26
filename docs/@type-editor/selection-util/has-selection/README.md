[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/selection-util](../README.md) / has-selection

# has-selection

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

[hasSelection](functions/hasSelection.md)

</td>
<td>

Checks if the editor contains a valid DOM selection.

This function verifies that:

1. An anchor node exists in the selection
2. The anchor node is within the editor DOM
3. For non-editable views, the focus node is also within the editor DOM

Text nodes (nodeType === 3) are checked via their parent element.
This is wrapped in a try-catch because Firefox throws 'permission denied'
errors when accessing properties of nodes in generated CSS elements.

</td>
</tr>
</tbody>
</table>
