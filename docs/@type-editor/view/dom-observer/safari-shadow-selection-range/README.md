[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/view](../../README.md) / dom-observer/safari-shadow-selection-range

# dom-observer/safari-shadow-selection-range

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

[safariShadowSelectionRange](functions/safariShadowSelectionRange.md)

</td>
<td>

Workaround for Safari Selection/shadow DOM bug.
Safari (at least in 2018-2022) doesn't provide regular access to the selection
inside a shadowRoot, so we use execCommand to trigger a beforeInput event
that gives us access to the selection range.

Based on https://github.com/codemirror/dev/issues/414 fix.

</td>
</tr>
</tbody>
</table>
