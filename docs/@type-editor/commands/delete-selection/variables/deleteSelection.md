[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [delete-selection](../README.md) / deleteSelection

# Variable: deleteSelection

```ts
const deleteSelection: Command;
```

Defined in: [delete-selection.ts:26](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/commands/src/delete-selection.ts#L26)

Deletes the current selection if one exists.

This command removes all content within the current selection range. If the selection
is empty (just a cursor position), the command returns `false` and does nothing.
After deletion, the view is scrolled to keep the cursor visible.

This is typically used as the first command in a chain for delete operations, allowing
more specific deletion behaviors to take over when there's no selection.

## Param

The current editor state

## Param

Optional dispatch function to execute the transaction

## Returns

`true` if there was a selection to delete, `false` if the selection was empty

## Example

```typescript
// Use as part of a delete key handler
const keymap = {
  Backspace: chainCommands(deleteSelection, joinBackward),
  Delete: chainCommands(deleteSelection, joinForward),
};
```
