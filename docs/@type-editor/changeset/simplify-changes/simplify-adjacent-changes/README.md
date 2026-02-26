[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/changeset](../../README.md) / simplify-changes/simplify-adjacent-changes

# simplify-changes/simplify-adjacent-changes

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

[simplifyAdjacentChanges](functions/simplifyAdjacentChanges.md)

</td>
<td>

Processes a group of adjacent changes and adds simplified versions to the target array.

This function examines changes in a group to determine if they should be merged.
Changes are merged if they're within the same word (no word boundary between them).
Mixed insertions/deletions are expanded to word boundaries unless they're single
character replacements.

</td>
</tr>
</tbody>
</table>
