[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/collab](../README.md) / sendable-steps

# sendable-steps

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

[sendableSteps](functions/sendableSteps.md)

</td>
<td>

Provides data describing the editor's unconfirmed steps, which need
to be sent to the central authority. Returns null when there is
nothing to send.

The `origins` property holds the _original_ transforms that produced each
step. This can be useful for looking up timestamps and other
metadata for the steps, but note that the steps may have been
rebased, whereas the origin transforms are still the old,
unchanged objects.

</td>
</tr>
</tbody>
</table>
