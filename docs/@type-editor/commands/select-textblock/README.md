[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/commands](../README.md) / select-textblock

# select-textblock

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

[selectTextblockEnd](variables/selectTextblockEnd.md)

</td>
<td>

Moves the cursor to the end of the current textblock.

This command finds the containing textblock (navigating up from inline nodes if necessary)
and positions the cursor at its end. This is useful for:

- Implementing "End" key behavior at the block level
- Quickly navigating to the end of paragraphs or headings
- Providing text selection ending points

The command will fail if the cursor is not within a textblock.

**Example**

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

</td>
</tr>
<tr>
<td>

[selectTextblockStart](variables/selectTextblockStart.md)

</td>
<td>

Moves the cursor to the start of the current textblock.

This command finds the containing textblock (navigating up from inline nodes if necessary)
and positions the cursor at its start. This is useful for:

- Implementing "Home" key behavior at the block level
- Quickly navigating to the beginning of paragraphs or headings
- Providing text selection starting points

The command will fail if the cursor is not within a textblock.

**Example**

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

</td>
</tr>
</tbody>
</table>
