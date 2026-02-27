[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [split-block-keep-marks](../README.md) / splitBlockKeepMarks

# Variable: splitBlockKeepMarks

```ts
const splitBlockKeepMarks: Command;
```

Defined in: [split-block-keep-marks.ts:42](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/commands/src/split-block-keep-marks.ts#L42)

Splits a block while preserving active marks.

This command works exactly like `splitBlock`, but it preserves the active marks
at the cursor position when creating the new block. This is essential for maintaining
formatting context when splitting blocks during typing.

**Mark Preservation Logic**:

- Uses stored marks if they exist (e.g., after toggling a mark without typing)
- Otherwise, uses the marks at the cursor position (if not at the start of the parent)
- Ensures these marks are applied to the new block

This behavior is typically desired for Enter key handling in rich text editors,
where users expect formatting to continue into the next paragraph.

## Param

The current editor state

## Param

Optional dispatch function to execute the transaction

## Returns

`true` if the split was performed, `false` otherwise

## Example

```typescript
// Use for Enter key to maintain formatting
const keymap = {
  Enter: chainCommands(
    newlineInCode,
    exitCode,
    liftEmptyBlock,
    splitBlockKeepMarks,
  ),
};

// Compare behaviors:
// splitBlock: **bold text**|  → Press Enter → **bold text**\n|
// splitBlockKeepMarks: **bold text**|  → Press Enter → **bold text**\n**|**
```
