[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/history](../../README.md) / state/Branch

# state/Branch

## Classes

<table>
<thead>
<tr>
<th>Class</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[Branch](classes/Branch.md)

</td>
<td>

Represents a branch in the history tree (either undo or redo history).

A branch maintains a sequence of items that represent the history of changes,
where each item can contain a step (an actual change) and/or a position map
(for transforming positions through the change).

</td>
</tr>
<tr>
<td>

[Item](classes/Item.md)

</td>
<td>

Represents a single item in the history branch.

An item can contain a step (an actual change), a position map (for tracking position changes),
and optionally a selection bookmark (marking the start of an event).

</td>
</tr>
</tbody>
</table>
