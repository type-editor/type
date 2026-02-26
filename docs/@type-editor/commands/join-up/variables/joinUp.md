[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [join-up](../README.md) / joinUp

# Variable: joinUp

```ts
const joinUp: Command;
```

Defined in: [join-up.ts:44](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/commands/src/join-up.ts#L44)

Joins the selected block with the block above it.

This command attempts to join the selected block (or the closest ancestor block)
with its previous sibling. The behavior differs based on the selection type:

- **Node Selection**: Joins at the start of the selected node and maintains node selection
- **Text Selection**: Finds the nearest joinable point before the selection

When a node selection is used and the join succeeds, the command will automatically
select the joined node to maintain the user's selection context.

The command will fail if:

- A textblock node is selected (textblocks can't be joined this way)
- No valid join point exists before the selection
- The structure doesn't allow joining

## Param

The current editor state

## Param

Optional dispatch function to execute the transaction

## Returns

`true` if the join was performed, `false` otherwise

## Example

```typescript
// Bind to a key for joining blocks upward
const keymap = {
  "Alt-ArrowUp": joinUp,
};

// Use in a menu item
const menuItem = {
  label: "Join with block above",
  run: joinUp,
  enable: (state) => joinUp(state),
};
```
