[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [select-node-forward](../README.md) / selectNodeForward

# Variable: selectNodeForward

```ts
const selectNodeForward: Command;
```

Defined in: [select-node-forward.ts:42](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/commands/src/select-node-forward.ts#L42)

Selects the node after the cursor when at the end of a textblock.

This command provides fallback behavior for the Delete/Forward-Delete key when
structural deletion isn't possible. When the cursor is at the end of a textblock
and normal forward joining fails, this command selects the node after the textblock
(if it's selectable), allowing the user to delete it with a subsequent keypress.

This is particularly useful for:

- Selecting and deleting block nodes (images, horizontal rules, etc.)
- Handling cases where the schema prevents normal joining
- Providing consistent behavior for navigating/selecting forward

The command only works when:

- The selection is empty (just a cursor)
- The cursor is at the end of a textblock (or not in a textblock)
- There's a selectable node after the cursor

## Param

The current editor state

## Param

Optional dispatch function to execute the transaction

## Param

Optional editor view for accurate cursor position detection

## Returns

`true` if a node was selected, `false` otherwise

## Example

```typescript
// Use as fallback in Delete key handling
const keymap = {
  Delete: chainCommands(deleteSelection, joinForward, selectNodeForward),
};
```
