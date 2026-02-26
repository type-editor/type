[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/editor-types](../../../../README.md) / types/state/selection/SelectionBookmark

# types/state/selection/SelectionBookmark

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

[SelectionBookmark](interfaces/SelectionBookmark.md)

</td>
<td>

A lightweight, document-independent representation of a selection.
You can define a custom bookmark type for a custom selection class
to make the history handle it well.

Bookmarks store selection positions as simple numbers rather than
resolved positions, making them suitable for persistence across
document changes. They can be mapped through document transformations
and then resolved back into full selections.

</td>
</tr>
</tbody>
</table>
