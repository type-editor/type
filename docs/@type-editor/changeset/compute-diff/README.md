[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/changeset](../README.md) / compute-diff

# compute-diff

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

[computeDiff](functions/computeDiff.md)

</td>
<td>

Compute the difference between two fragments using Myers' diff algorithm.

This implementation optimizes by first scanning from both ends to eliminate
unchanged content, then applies the Myers algorithm to the remaining content.
For performance reasons, the diff computation is limited by MAX_DIFF_SIZE.

</td>
</tr>
</tbody>
</table>
