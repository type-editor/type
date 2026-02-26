[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / util/find-extended-mark-selection

# util/find-extended-mark-selection

## Interfaces

<table>
<thead>
<tr>
<th>Interface</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[ExtendedSelectionResult](interfaces/ExtendedSelectionResult.md)

</td>
<td>

Result of attempting to find an extended selection for an empty selection.

</td>
</tr>
</tbody>
</table>

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

[findExtendedMarkSelection](functions/findExtendedMarkSelection.md)

</td>
<td>

Attempts to find an extended selection for an empty selection.

If the cursor is within a range that has the specified mark type, extends
the selection to cover the entire contiguous marked range. This is useful
for toggling marks like links where the user positions the cursor inside
the linked text and expects the entire link to be toggled.

If not within a marked range, falls back to selecting a single adjacent
character (first checking before, then after the cursor).

</td>
</tr>
</tbody>
</table>
