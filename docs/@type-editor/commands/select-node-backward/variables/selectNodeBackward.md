[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [select-node-backward](../README.md) / selectNodeBackward

# Variable: selectNodeBackward

```ts
const selectNodeBackward: Command;
```

Defined in: [select-node-backward.ts:42](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/commands/src/select-node-backward.ts#L42)

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
// Use as fallback in Backspace handling
const keymap = {
  Backspace: chainCommands(deleteSelection, joinBackward, selectNodeBackward),
};
```
