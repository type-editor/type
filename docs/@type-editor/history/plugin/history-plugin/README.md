[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/history](../../README.md) / plugin/history-plugin

# plugin/history-plugin

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

[history](functions/history.md)

</td>
<td>

Returns a plugin that enables the undo history for an editor. The
plugin will track undo and redo stacks, which can be used with the
[`undo`](#history.undo) and [`redo`](#history.redo) commands.
\<br/\>
You can set an `'addToHistory'` [metadata
property](#state.Transaction.setMeta) of `false` on a transaction
to prevent it from being rolled back by undo.

</td>
</tr>
</tbody>
</table>
