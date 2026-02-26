[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-change-util](../../README.md) / parse-change/is-mark-change

# parse-change/is-mark-change

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

[isMarkChange](functions/isMarkChange.md)

</td>
<td>

Determines whether one fragment could be created from another by adding or removing
a single mark type. Used to optimize mark changes.

This is an optimization for detecting when a change is just adding or removing
formatting (like bold or italic) without changing the actual text content. When
detected, the change can be applied as a mark operation instead of a full content
replacement, which is more efficient and maintains better edit history.

The detection process:

1. Compares marks on the first child of each fragment
2. Calculates which marks were added and which were removed
3. If exactly one mark was added OR one was removed, it's a mark change
4. Applies the mark operation to all children and verifies it recreates the current fragment

Returns null if:

- Either fragment is empty
- More than one mark changed
- Both marks were added and removed
- Applying the mark change doesn't recreate the current fragment

**See**

[MarkChangeInfo](../../types/dom-change/MarkChangeInfo/interfaces/MarkChangeInfo.md) for return type structure

</td>
</tr>
</tbody>
</table>
