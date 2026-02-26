[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-change-util](../../README.md) / browser-hacks/should-handle-android-enter-key

# browser-hacks/should-handle-android-enter-key

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

[shouldHandleAndroidEnterKey](functions/shouldHandleAndroidEnterKey.md)

</td>
<td>

Checks if an Android Chrome Enter key event should be handled.

Android Chrome has timing-related quirks with Enter key handling. This function
checks if the conditions match an Android Chrome Enter key press that should
be handled through the key handler rather than as a DOM change.

The check verifies:

- Running on Chrome for Android
- Last key pressed was Enter (key code 13)
- The Enter key was pressed recently (within threshold)
- A handleKeyDown plugin accepts the Enter key event

</td>
</tr>
</tbody>
</table>
