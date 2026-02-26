[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-change-util](../../README.md) / parse-change/handle-selection-only-change

# parse-change/handle-selection-only-change

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

[handleSelectionOnlyChange](functions/handleSelectionOnlyChange.md)

</td>
<td>

Handles selection-only changes (when no content has changed).

This function is called when a DOM change event indicates a selection change
but no content modification. It reads the current DOM selection, creates a
transaction to update the editor selection, and dispatches it.

The function also:

- Determines the selection origin (pointer, key, or null) based on timing
- Handles Android Chrome Enter key edge cases
- Adds appropriate metadata to the transaction (pointer, scrollIntoView, composition)

If the new selection is identical to the current selection, no action is taken.

**See**

- selectionFromDOM for how selection is read from DOM
- [shouldHandleAndroidEnterKey](../../browser-hacks/should-handle-android-enter-key/functions/shouldHandleAndroidEnterKey.md) for Android Enter key handling

</td>
</tr>
</tbody>
</table>
