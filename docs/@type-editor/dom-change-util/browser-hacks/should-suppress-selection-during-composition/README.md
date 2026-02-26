[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-change-util](../../README.md) / browser-hacks/should-suppress-selection-during-composition

# browser-hacks/should-suppress-selection-during-composition

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

[shouldSuppressSelectionDuringComposition](functions/shouldSuppressSelectionDuringComposition.md)

</td>
<td>

Checks if selection should be suppressed due to Chrome composition issues.

During IME composition and in certain edge cases, Chrome and IE have quirks
where they report incorrect selection positions. This function detects those
cases so that the selection update can be skipped.

**Chrome composition issue:**
During composition, Chrome sometimes reports the selection in the wrong place.
The check detects this by looking for:

- Chrome browser during composition
- Empty (collapsed) selection
- Recent delete operation OR change is not zero-width
- Selection head is at the start of the change or at the mapped end

**IE edge case:**
IE doesn't move the cursor forward when starting to type in an empty block
or between BR nodes. Detected by:

- IE browser
- Empty selection at the start of the change

In both cases, the selection update is skipped to avoid placing the cursor
in the wrong position.

</td>
</tr>
</tbody>
</table>
