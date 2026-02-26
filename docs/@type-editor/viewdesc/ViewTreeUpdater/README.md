[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/viewdesc](../README.md) / ViewTreeUpdater

# ViewTreeUpdater

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

[ViewTreeUpdater](classes/ViewTreeUpdater.md)

</td>
<td>

Helper class for incrementally updating a tree of mark descs and
the widget and node descs inside of them.

This class maintains a cursor through the existing view desc tree while
iterating through the new document content, trying to reuse existing
view descs where possible. It handles:

- Nested mark descs (maintains a stack as it enters/exits marks)
- Node and widget descs
- DOM composition protection (won't modify locked nodes)

</td>
</tr>
</tbody>
</table>
