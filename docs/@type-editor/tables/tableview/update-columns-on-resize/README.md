[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / tableview/update-columns-on-resize

# tableview/update-columns-on-resize

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

[updateColumnsOnResize](functions/updateColumnsOnResize.md)

</td>
<td>

Updates the column widths of a table's colgroup to match the document state.

This function synchronizes the visual column widths (via `<col>` elements in the colgroup)
with the column width attributes stored in the table cells. It handles:

- Creating new `<col>` elements when needed
- Updating existing `<col>` element widths
- Removing excess `<col>` elements
- Setting the table's overall width or min-width based on column configuration

</td>
</tr>
</tbody>
</table>
