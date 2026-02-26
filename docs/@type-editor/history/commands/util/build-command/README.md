[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/history](../../../README.md) / commands/util/build-command

# commands/util/build-command

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

[buildCommand](functions/buildCommand.md)

</td>
<td>

Builds a command that performs undo or redo operations.

This factory function creates command functions that can be used in keymaps
or executed programmatically. The returned command follows the ProseMirror
command pattern: it returns true if the command is applicable (even if not
executed due to lack of dispatch), and false if it's not applicable.

</td>
</tr>
</tbody>
</table>
