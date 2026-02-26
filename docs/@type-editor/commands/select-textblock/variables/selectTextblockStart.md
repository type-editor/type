[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [select-textblock](../README.md) / selectTextblockStart

# Variable: selectTextblockStart

```ts
const selectTextblockStart: Command;
```

Defined in: [select-textblock.ts:40](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/commands/src/select-textblock.ts#L40)

Moves the cursor to the start of the current textblock.

This command finds the containing textblock (navigating up from inline nodes if necessary)
and positions the cursor at its start. This is useful for:

- Implementing "Home" key behavior at the block level
- Quickly navigating to the beginning of paragraphs or headings
- Providing text selection starting points

The command will fail if the cursor is not within a textblock.

## Example

```typescript
// Bind to Home key for block-level navigation
const keymap = {
  Home: selectTextblockStart,
  "Mod-Home": selectTextblockStart,
};

// Use with Shift for selection
const keymap = {
  "Shift-Home": (state, dispatch) => {
    const anchor = state.selection.anchor;
    if (
      selectTextblockStart(state, (tr) => {
        tr.setSelection(
          TextSelection.create(tr.doc, anchor, tr.selection.head),
        );
        if (dispatch) dispatch(tr);
      })
    )
      return true;
    return false;
  },
};
```
