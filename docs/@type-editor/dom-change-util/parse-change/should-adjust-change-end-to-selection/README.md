[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-change-util](../../README.md) / parse-change/should-adjust-change-end-to-selection

# parse-change/should-adjust-change-end-to-selection

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

[shouldAdjustChangeEndToSelection](functions/shouldAdjustChangeEndToSelection.md)

</td>
<td>

Checks if change end should be adjusted to selection end.

Similar to start adjustment, when typing at the end of a selection, if the
typed character matches the character at the selection end, the diff algorithm
might place the change end before that matching character. This function
detects that case.

The adjustment is needed when:

- The detected change ends before the selection end
- But is very close (within 2 positions) to the selection end
- And the selection end is within the parsed range

When this condition is met, both endA and endB of the change are adjusted
to match the selection boundary.

</td>
</tr>
</tbody>
</table>
