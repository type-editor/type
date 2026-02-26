[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-change-util](../../README.md) / browser-hacks/looks-likes-enter-key-ios

# browser-hacks/looks-likes-enter-key-ios

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

[looksLikesEnterKeyiOS](functions/looksLikesEnterKeyiOS.md)

</td>
<td>

Checks if the change looks like the effect of pressing the Enter key.

Sometimes it's better to handle block creation through the Enter key handler
rather than as a DOM change. This function detects those cases for iOS:

**iOS Enter Detection:**
iOS specifically tracks Enter key presses. If a recent Enter was detected
and either the change is not inline or block elements (DIV/P) were added,
treat it as an Enter key press.

</td>
</tr>
</tbody>
</table>
