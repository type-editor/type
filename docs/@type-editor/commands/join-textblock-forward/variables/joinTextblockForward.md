[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [join-textblock-forward](../README.md) / joinTextblockForward

# Variable: joinTextblockForward

```ts
const joinTextblockForward: Command;
```

Defined in: [join-textblock-forward.ts:39](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/commands/src/join-textblock-forward.ts#L39)

Joins the current textblock with the textblock after it.

This is a more focused version of `joinForward` that specifically handles joining
textblocks. It only works when the cursor is at the end of a textblock and attempts
to join it with the textblock after it, even if they're nested in different structures.

The command navigates down through nested structures to find the actual textblocks
to join, making it work correctly with complex document structures like nested lists
or blockquotes.

This command will fail if:

- The cursor is not at the end of a textblock
- There's no textblock after the current one
- The blocks are separated by isolating nodes
- The join operation is not structurally valid

## Param

The current editor state

## Param

Optional dispatch function to execute the transaction

## Param

Optional editor view for accurate cursor position detection

## Returns

`true` if the join was performed, `false` otherwise

## Example

```typescript
// Use as an alternative to joinForward for stricter textblock joining
const keymap = {
  "Shift-Delete": joinTextblockForward,
};
```
