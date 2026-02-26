[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / cellselection/normalize-selection

# cellselection/normalize-selection

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

[normalizeSelection](functions/normalizeSelection.md)

</td>
<td>

Normalizes table-related selections to ensure consistent behavior.

This function handles several edge cases:

- Converts node selections on cells to CellSelection
- Converts node selections on rows to full row CellSelection
- Converts node selections on tables to select all cells (if not allowed)
- Normalizes selections at cell boundaries to collapsed selections
- Normalizes text selections spanning multiple cells to stay within the first cell

</td>
</tr>
</tbody>
</table>
