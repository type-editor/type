[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [join-textblock-backward](../README.md) / joinTextblockBackward

# Variable: joinTextblockBackward

```ts
const joinTextblockBackward: Command;
```

Defined in: [join-textblock-backward.ts:39](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/commands/src/join-textblock-backward.ts#L39)

Joins the current textblock with the textblock before it.

This is a more focused version of `joinBackward` that specifically handles joining
textblocks. It only works when the cursor is at the start of a textblock and attempts
to join it with the textblock before it, even if they're nested in different structures.

The command navigates down through nested structures to find the actual textblocks
to join, making it work correctly with complex document structures like nested lists
or blockquotes.

This command will fail if:

- The cursor is not at the start of a textblock
- There's no textblock before the current one
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
// Use as an alternative to joinBackward for stricter textblock joining
const keymap = {
  "Shift-Backspace": joinTextblockBackward,
};
```
