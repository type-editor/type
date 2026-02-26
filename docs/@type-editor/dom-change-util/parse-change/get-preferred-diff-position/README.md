[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-change-util](../../README.md) / parse-change/get-preferred-diff-position

# parse-change/get-preferred-diff-position

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

[getPreferredDiffPosition](functions/getPreferredDiffPosition.md)

</td>
<td>

Determines the preferred position and side for diff calculation.

The diff algorithm needs to know where the user's cursor was to make better
decisions about how to align changes. This function determines the preferred
position based on recent keypress activity:

- **After Backspace:** Prefers anchoring to the end (selection.to) since
  backspace deletes backwards from the cursor position
- **Otherwise:** Prefers anchoring to the start (selection.from) which is
  the default for insertions and other changes

The preferred side ('start' or 'end') affects how ambiguous changes are
resolved in the diff algorithm.

**See**

findDiff for how these values are used

</td>
</tr>
</tbody>
</table>
