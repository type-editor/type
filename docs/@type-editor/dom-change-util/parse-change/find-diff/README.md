[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-change-util](../../README.md) / parse-change/find-diff

# parse-change/find-diff

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

[findDiff](functions/findDiff.md)

</td>
<td>

Finds the difference between two fragments and returns the positions of the change.

This is the core diff algorithm for detecting what changed between the old document
and the parsed DOM content. It uses ProseMirror's built-in diff methods and then
applies sophisticated adjustments to handle edge cases.

**Algorithm Steps:**

1. **Find diff start:** Use Fragment.findDiffStart to find where content diverges
2. **Find diff end:** Use Fragment.findDiffEnd to find where content converges again
3. **Adjust for preferred position:** When the user's cursor is known, bias the
   diff boundaries toward that position for more intuitive change detection
4. **Handle surrogate pairs:** Unicode characters outside BMP use surrogate pairs;
   ensure we don't split them when adjusting boundaries

**Preferred Position Handling:**

When preferredPos is between the diff boundaries, the algorithm tries to move
the boundaries to include the cursor position. This ensures changes appear to
happen at the cursor rather than at arbitrary matching text positions.

For example, if typing "a" in "bat" where cursor is after "b", prefer detecting
the change as "b|at" → "ba|at" rather than "ba|t" → "ba|at".

**Surrogate Pair Handling:**

UTF-16 surrogate pairs (used for emoji and other non-BMP characters) must not
be split. When adjusting boundaries, if we land in the middle of a surrogate
pair, adjust by one position to keep the pair intact.

**See**

- [DocumentChange](../../types/dom-change/DocumentChange/interfaces/DocumentChange.md) for return type structure
- getPreferredDiffPosition for how preferred position is determined

**Remarks**

Includes special handling for Unicode surrogate pairs (e.g., emoji)

</td>
</tr>
</tbody>
</table>
