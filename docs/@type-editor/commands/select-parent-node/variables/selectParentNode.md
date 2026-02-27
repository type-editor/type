[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [select-parent-node](../README.md) / selectParentNode

# Variable: selectParentNode

```ts
const selectParentNode: Command;
```

Defined in: [select-parent-node.ts:48](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/commands/src/select-parent-node.ts#L48)

Selects the parent node that wraps the current selection.

This command expands the selection to encompass the parent node containing
the current selection. It's useful for:

- Progressively expanding selection to outer nodes
- Selecting block nodes for operations like deletion or replacement
- Navigating up the document structure
- Providing "expand selection" functionality

The command finds the deepest node that fully contains the current selection
and creates a node selection for it. It will not select the document root node,
as that would be the entire document (use `selectAll` for that instead).

The command will fail if:

- The selection is already at the document level (depth 0)
- There's no valid parent node to select

## Param

The current editor state

## Param

Optional dispatch function to execute the transaction

## Returns

`true` if a parent node was selected, `false` otherwise

## Example

```typescript
// Bind to Escape key for expanding selection
const keymap = {
  Escape: selectParentNode,
};

// Use to create "expand selection" functionality
const menuItem = {
  label: "Select parent",
  run: selectParentNode,
  enable: (state) => selectParentNode(state),
};

// Repeatedly call to expand selection outward
let state = view.state;
while (selectParentNode(state)) {
  state = state.apply(state.transaction);
}
```
