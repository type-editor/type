[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-change-util](../../README.md) / parse-change/looks-like-enter-key

# parse-change/looks-like-enter-key

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

[looksLikeEnterKey](functions/looksLikeEnterKey.md)

</td>
<td>

Checks if the change looks like the effect of pressing the Enter key.

Sometimes it's better to handle block creation through the Enter key handler
rather than as a DOM change. This function detects those cases using two
different strategies:

**iOS Enter Detection:**
iOS specifically tracks Enter key presses. If a recent Enter was detected
and either the change is not inline or block elements (DIV/P) were added,
treat it as an Enter key press.

**Generic Block Enter Detection:**
For other platforms, detect Enter by checking if:

- Change is not inline (block-level)
- Positions are within document bounds
- Positions are in different parents or not in inline content
- Content between positions is whitespace-only (empty paragraph)

If detected, the change is delegated to the handleKeyDown plugin system
with an Enter key event.

</td>
</tr>
</tbody>
</table>
