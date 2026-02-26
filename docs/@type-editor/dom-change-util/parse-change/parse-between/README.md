[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-change-util](../../README.md) / parse-change/parse-between

# parse-change/parse-between

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

[parseBetween](functions/parseBetween.md)

</td>
<td>

Parses a range of DOM content into a ProseMirror document fragment.

This function is the core of DOM change detection. It takes a range of positions
in the document, finds the corresponding DOM nodes, parses them into a ProseMirror
document, and attempts to reconstruct the selection state. It also applies various
browser-specific workarounds during the parsing process.

The parsing process:

1. Determines the DOM range to parse
2. Builds position tracking for selection reconstruction
3. Applies browser-specific adjustments (e.g., Chrome backspace bug)
4. Parses the DOM into a ProseMirror document
5. Reconstructs selection from tracked positions

**See**

[adjustForChromeBackspaceBug](../../browser-hacks/adjust-for-chrome-backspace-bug/functions/adjustForChromeBackspaceBug.md) for browser-specific adjustments

</td>
</tr>
</tbody>
</table>
