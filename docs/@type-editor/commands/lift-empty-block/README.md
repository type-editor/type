[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/commands](../README.md) / lift-empty-block

# lift-empty-block

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

[liftEmptyBlock](variables/liftEmptyBlock.md)

</td>
<td>

Lifts an empty textblock out of its parent structure.

This command handles the special case of empty textblocks, providing intelligent
behavior depending on the context:

**Split Strategy**: If the empty block is nested and not at the end of its parent,
the command splits the parent structure instead of lifting. This is particularly
useful for:

- Breaking out of nested list items
- Creating a new block after a nested structure

**Lift Strategy**: Otherwise, the command lifts the empty block out of its parent,
effectively removing one level of nesting.

This command is commonly used to handle the Enter key in empty blocks, allowing
users to naturally escape from nested structures.

The command only works when:

- The selection is a cursor (not a range)
- The cursor is in an empty textblock
- Either splitting or lifting is structurally valid

**Param**

The current editor state

**Param**

Optional dispatch function to execute the transaction

**Example**

```typescript
// Use in Enter key handling for empty blocks
const keymap = {
  Enter: chainCommands(liftEmptyBlock, splitBlock),
};

// Use for Backspace to lift empty blocks
const keymap = {
  Backspace: chainCommands(deleteSelection, liftEmptyBlock, joinBackward),
};
```

</td>
</tr>
</tbody>
</table>
