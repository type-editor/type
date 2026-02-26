[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/state](../../README.md) / selection/TextSelection

# selection/TextSelection

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

[TextSelection](classes/TextSelection.md)

</td>
<td>

A text selection represents a classical editor selection, with a
head (the moving side) and anchor (immobile side), both of which
point into textblock nodes. It can be empty (a regular cursor
position).

This is the most common selection type, representing standard text
editing selections. When anchor equals head, it represents a cursor
position. When they differ, it represents a range of selected text.

Both anchor and head must point into nodes with inline content
(text blocks). A warning will be logged in development mode if
this constraint is violated.

</td>
</tr>
</tbody>
</table>
