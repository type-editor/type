[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-change-util](../../README.md) / parse-change/looks-like-backspace-key

# parse-change/looks-like-backspace-key

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

[looksLikeBackspaceKey](functions/looksLikeBackspaceKey.md)

</td>
<td>

Checks if the change looks like the effect of pressing the Backspace key.

Similar to Enter detection, some backspace operations (especially block joins)
are better handled through the Backspace key handler. This function detects
if a change looks like a backspace operation by checking:

- The selection anchor is after the change start (backspacing backwards)
- The change matches the backspace pattern (see looksLikeBackspace)
- A handleKeyDown plugin accepts the Backspace key event

The detailed backspace detection logic is in the looksLikeBackspace function.

**See**

[looksLikeBackspace](../looks-like-backspace/functions/looksLikeBackspace.md) for detailed backspace detection logic

</td>
</tr>
</tbody>
</table>
