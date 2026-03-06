[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [lift-empty-block](../README.md) / liftEmptyBlock

# Variable: liftEmptyBlock

```ts
const liftEmptyBlock: Command;
```

Defined in: [lift-empty-block.ts:53](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/commands/src/lift-empty-block.ts#L53)

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

## Param

The current editor state

## Param

Optional dispatch function to execute the transaction

## Returns

`true` if the operation was performed, `false` otherwise

## Example

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
