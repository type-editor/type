[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/tables](../README.md) / table-editing-plugin

# table-editing-plugin

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

[tableEditingPlugin](functions/tableEditingPlugin.md)

</td>
<td>

Creates a [plugin](http://prosemirror.net/docs/ref/#state.Plugin)
that, when added to an editor, enables cell-selection, handles
cell-based copy/paste, and makes sure tables stay well-formed (each
row has the same width, and cells don't overlap).

You should probably put this plugin near the end of your array of
plugins, since it handles mouse and arrow key events in tables
rather broadly, and other plugins, like the gap cursor or the
column-width dragging plugin, might want to get a turn first to
perform more specific behavior.

</td>
</tr>
</tbody>
</table>
