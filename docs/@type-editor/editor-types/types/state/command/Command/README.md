[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/editor-types](../../../../README.md) / types/state/command/Command

# types/state/command/Command

## Type Aliases

<table>
<thead>
<tr>
<th>Type Alias</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[Command](type-aliases/Command.md)

</td>
<td>

Commands are functions that take a state and a an optional
transaction dispatch function and...

- determine whether they apply to this state
- if not, return false
- if `dispatch` was passed, perform their effect, possibly by
  passing a transaction to `dispatch`
- return true

In some cases, the editor view is passed as a third argument.

</td>
</tr>
</tbody>
</table>
