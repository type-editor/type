[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/selection-util](../README.md) / selection-between

# selection-between

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

[selectionBetween](functions/selectionBetween.md)

</td>
<td>

Creates a selection between two resolved positions.

This function first checks if any plugins provide a custom 'createSelectionBetween'
method. If not, it falls back to creating a standard text selection. This allows
plugins to implement custom selection types (e.g., table cell selections).

</td>
</tr>
</tbody>
</table>
