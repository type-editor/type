[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-change-util](../../README.md) / parse-change/should-create-type-over-change

# parse-change/should-create-type-over-change

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

[shouldCreateTypeOverChange](functions/shouldCreateTypeOverChange.md)

</td>
<td>

Checks if a change should be created for typing over a selection.

When typing with a selection active, the editor should replace the selected
content. However, sometimes no DOM change is detected (perhaps because the
browser hasn't yet processed the change). This function detects if we're in
that situation and should create a synthetic change.

The conditions checked are:

- typeOver flag is set (indicates user is typing to replace selection)
- Selection is a text selection (not a node selection)
- Selection is not empty (something is selected)
- Selection is within a single parent node
- Editor is not in composition mode (not using IME)
- Parsed selection is collapsed or undefined (no range in parsed content)

</td>
</tr>
</tbody>
</table>
