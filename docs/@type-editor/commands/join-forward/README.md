[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/commands](../README.md) / join-forward

# join-forward

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

[joinForward](variables/joinForward.md)

</td>
<td>

Joins or merges the current block with the one after it when the cursor is at the end
of a textblock.

This command implements comprehensive forward-joining behavior with multiple fallback strategies:

1. **Delete Barrier**: Try to remove structural barriers between blocks and join them
2. **Delete Empty Block**: If the current block is empty, delete it and select the content after
3. **Delete Atomic Node**: If the node after is atomic, delete it

The command uses the view (if provided) for accurate bidirectional text detection
to determine if the cursor is truly at the end of the block.

This is the forward counterpart to `joinBackward` and is typically used as part of
the delete/forward-delete key behavior.

**Param**

The current editor state

**Param**

Optional dispatch function to execute the transaction

**Param**

Optional editor view for accurate cursor position detection

**Example**

```typescript
// Use as part of delete key behavior
const keymap = {
  Delete: chainCommands(deleteSelection, joinForward, selectNodeForward),
};
```

</td>
</tr>
</tbody>
</table>
