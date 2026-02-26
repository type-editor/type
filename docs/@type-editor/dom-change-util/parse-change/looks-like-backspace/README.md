[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-change-util](../../README.md) / parse-change/looks-like-backspace

# parse-change/looks-like-backspace

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

[looksLikeBackspace](functions/looksLikeBackspace.md)

</td>
<td>

Determines if a change looks like a backspace operation (joining or deleting blocks).

This function performs a sophisticated analysis to detect if a change resulted from
a backspace operation. Backspace can either delete an entire block or join two blocks
together. The detection helps determine if the change should be delegated to the
Backspace key handler instead of being processed as a regular DOM change.

**Detection Logic:**

1. **Content must have shrunk:** The old content range must be larger than the new range
2. **Valid end position:** The new end position must be at or after the block boundary
3. **Block deletion:** If not in a textblock, check if an entire block was removed
4. **Block join:** If in a textblock, verify:
   - Start is at the end of a textblock
   - Next textblock exists and was joined
   - Content after join point matches

The function uses internal helpers to navigate block boundaries and verify
that the structure matches a backspace operation pattern.

</td>
</tr>
</tbody>
</table>
