[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / util/chain-commands

# util/chain-commands

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

[chainCommands](functions/chainCommands.md)

</td>
<td>

Combines multiple command functions into a single command that executes them sequentially
until one succeeds.

This function creates a command that tries each provided command in order. The first command
that returns `true` (indicating success) will stop the chain, and the chained command will
return `true`. If all commands return `false`, the chained command returns `false`.

This is particularly useful for creating fallback behavior where you want to try multiple
strategies for handling a user action.

**Example**

```typescript
// Create a command that tries to delete selection, then join backward, then select backward
const myBackspaceCommand = chainCommands(
  deleteSelection,
  joinBackward,
  selectNodeBackward,
);

// Use in a keymap
const keymap = {
  Backspace: chainCommands(deleteSelection, joinBackward),
};
```

</td>
</tr>
</tbody>
</table>
