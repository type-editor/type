[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [select-textblock](../README.md) / selectTextblockEnd

# Variable: selectTextblockEnd

```ts
const selectTextblockEnd: Command;
```

Defined in: [select-textblock.ts:70](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/commands/src/select-textblock.ts#L70)

Moves the cursor to the end of the current textblock.

This command finds the containing textblock (navigating up from inline nodes if necessary)
and positions the cursor at its end. This is useful for:

- Implementing "End" key behavior at the block level
- Quickly navigating to the end of paragraphs or headings
- Providing text selection ending points

The command will fail if the cursor is not within a textblock.

## Example

```typescript
// Bind to End key for block-level navigation
const keymap = {
  End: selectTextblockEnd,
  "Mod-End": selectTextblockEnd,
};

// Create menu items for navigation
const menuItem = {
  label: "Jump to end of block",
  run: selectTextblockEnd,
};
```
