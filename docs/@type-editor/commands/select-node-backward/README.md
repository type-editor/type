[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/commands](../README.md) / select-node-backward

# select-node-backward

## Variables

<table>
<thead>
<tr>
<th>Variable</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[selectNodeBackward](variables/selectNodeBackward.md)

</td>
<td>

Selects the node before the cursor when at the start of a textblock.

This command provides fallback behavior for the Backspace key when structural
deletion isn't possible. When the cursor is at the start of a textblock and
normal backward joining fails, this command selects the node before the textblock
(if it's selectable), allowing the user to delete it with a subsequent keypress.

This is particularly useful for:

- Selecting and deleting block nodes (images, horizontal rules, etc.)
- Handling cases where the schema prevents normal joining
- Providing consistent behavior for navigating/selecting backward

The command only works when:

- The selection is empty (just a cursor)
- The cursor is at the start of a textblock (or not in a textblock)
- There's a selectable node before the cursor

**Param**

The current editor state

**Param**

Optional dispatch function to execute the transaction

**Param**

Optional editor view for accurate cursor position detection

**Example**

```typescript
// Use as fallback in Backspace handling
const keymap = {
  Backspace: chainCommands(deleteSelection, joinBackward, selectNodeBackward),
};
```

</td>
</tr>
</tbody>
</table>
