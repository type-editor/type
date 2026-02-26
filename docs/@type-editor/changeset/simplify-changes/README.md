[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/changeset](../README.md) / simplify-changes

# simplify-changes

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

[simplifyChanges](functions/simplifyChanges.md)

</td>
<td>

Simplifies a set of changes for presentation.

This function makes changes more readable by expanding insertions and deletions
that occur within the same word to cover entire words. This prevents confusing
partial-word changes while maintaining accuracy.

The algorithm:

1. Groups nearby changes (within MAX_SIMPLIFY_DISTANCE)
2. For mixed insertions/deletions in a group, expands to word boundaries
3. Preserves single-character replacements as-is
4. Merges adjacent changes when appropriate

</td>
</tr>
</tbody>
</table>
