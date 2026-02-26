[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-change-util](../../README.md) / parse-change/should-adjust-change-start-to-selection

# parse-change/should-adjust-change-start-to-selection

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

[shouldAdjustChangeStartToSelection](functions/shouldAdjustChangeStartToSelection.md)

</td>
<td>

Checks if change start should be adjusted to selection start.

When typing at the start of a selection, if the typed character matches the
character at the selection start, the diff algorithm might place the change
start after that matching character. This function detects that case.

The adjustment is needed when:

- The detected change starts after the selection start
- But is very close (within 2 positions) to the selection start
- And the selection start is within the parsed range

The threshold of 2 positions handles multi-byte characters and ensures
we don't over-adjust.

</td>
</tr>
</tbody>
</table>
