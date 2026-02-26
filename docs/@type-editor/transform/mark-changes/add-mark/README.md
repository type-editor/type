[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/transform](../../README.md) / mark-changes/add-mark

# mark-changes/add-mark

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

[addMark](functions/addMark.md)

</td>
<td>

Add a mark to all inline content between two positions.

When a mark is added, any marks that are incompatible with the new mark
will be removed from the affected range. The function optimizes by merging
consecutive steps that operate on adjacent ranges.

**Throws**

When from is greater than to.

</td>
</tr>
</tbody>
</table>
