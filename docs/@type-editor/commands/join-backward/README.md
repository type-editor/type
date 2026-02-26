[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/commands](../README.md) / join-backward

# join-backward

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

[joinBackward](variables/joinBackward.md)

</td>
<td>

Joins or merges the current block with the one before it when the cursor is at the start
of a textblock.

This command implements comprehensive backward-joining behavior with multiple fallback strategies:

1. **Direct Join**: If there's a compatible block directly before, join them
2. **Delete Barrier**: Try to remove structural barriers between blocks
3. **Delete Empty Block**: If the current block is empty, delete it and select the content before
4. **Delete Atomic Node**: If the node before is atomic, delete it
5. **Lift Block**: If no other strategy works, try to lift the block out of its parent

The command uses the view (if provided) for accurate bidirectional text detection
to determine if the cursor is truly at the start of the block.

**Param**

The current editor state

**Param**

Optional dispatch function to execute the transaction

**Param**

Optional editor view for accurate cursor position detection

**Example**

```typescript
// Use as part of backspace behavior
const keymap = {
  Backspace: chainCommands(deleteSelection, joinBackward, selectNodeBackward),
};
```

</td>
</tr>
</tbody>
</table>
