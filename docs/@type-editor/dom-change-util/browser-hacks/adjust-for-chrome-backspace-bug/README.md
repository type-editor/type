[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-change-util](../../README.md) / browser-hacks/adjust-for-chrome-backspace-bug

# browser-hacks/adjust-for-chrome-backspace-bug

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

[adjustForChromeBackspaceBug](functions/adjustForChromeBackspaceBug.md)

</td>
<td>

Adjusts the toOffset to work around Chrome's backspace bug where it sometimes
replaces deleted content with a random BR node (issues #799, #831).

Chrome has a quirk where after a backspace operation, it sometimes inserts
a stray BR element in the DOM. This function scans backwards from the end
of the range looking for such BR nodes that don't have an associated view
descriptor (indicating they're not part of the ProseMirror document structure).

The function also checks for empty view descriptors (size 0) and stops scanning
if it encounters a view descriptor with actual size, as that indicates real content.

This workaround is only applied on Chrome and only when the last key pressed
was Backspace.

**See**

- https://github.com/ProseMirror/prosemirror/issues/799
- https://github.com/ProseMirror/prosemirror/issues/831

</td>
</tr>
</tbody>
</table>
