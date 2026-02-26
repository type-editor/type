[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-change-util](../../README.md) / parse-change/resolve-selection

# parse-change/resolve-selection

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

[resolveSelection](functions/resolveSelection.md)

</td>
<td>

Resolves a selection from parsed anchor/head positions.

This function converts numeric positions from the parsed document into a proper
ProseMirror Selection object. It performs validation and uses the selectionBetween
helper to create the appropriate selection type (TextSelection, NodeSelection, etc.).

The function returns null if the positions are invalid (outside document bounds).
This can happen if the selection was in a part of the document that wasn't parsed
or if parsing failed to find the positions.

**See**

selectionBetween for selection creation logic

</td>
</tr>
</tbody>
</table>
