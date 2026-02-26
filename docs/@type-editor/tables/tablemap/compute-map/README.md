[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / tablemap/compute-map

# tablemap/compute-map

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

[computeMap](functions/computeMap.md)

</td>
<td>

Compute a table map for the given table node.

The map is a flat array where each element represents a cell in the grid.
The value at each position is the table-relative offset of the cell that
covers that grid position. Cells with colspan/rowspan will appear multiple
times in the array.

**Throws**

If the provided node is not a table

</td>
</tr>
</tbody>
</table>
