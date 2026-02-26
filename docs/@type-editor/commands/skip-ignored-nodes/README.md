[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/commands](../README.md) / skip-ignored-nodes

# skip-ignored-nodes

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

[skipIgnoredNodesAfter](functions/skipIgnoredNodesAfter.md)

</td>
<td>

Ensures the cursor isn't directly before one or more ignored nodes.

This function traverses forward from the current cursor position to find
and skip over any zero-size nodes that should be invisible to the user.

</td>
</tr>
<tr>
<td>

[skipIgnoredNodesBefore](functions/skipIgnoredNodesBefore.md)

</td>
<td>

Ensures the cursor isn't directly after one or more ignored nodes,
which would confuse the browser's cursor motion logic.

This function traverses backward from the current cursor position to find
and skip over any zero-size nodes that should be invisible to the user.

</td>
</tr>
</tbody>
</table>
