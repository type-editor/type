[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [join-down](../README.md) / joinDown

# Variable: joinDown

```ts
const joinDown: Command;
```

Defined in: [join-down.ts:38](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/commands/src/join-down.ts#L38)

Joins the selected block with the block below it.

This command attempts to join the selected block (or the closest ancestor block)
with its next sibling. The behavior differs based on the selection type:

- **Node Selection**: Joins at the end of the selected node if possible
- **Text Selection**: Finds the nearest joinable point after the selection

The command will fail if:

- A textblock node is selected (textblocks can't be joined this way)
- No valid join point exists after the selection
- The structure doesn't allow joining

## Param

The current editor state

## Param

Optional dispatch function to execute the transaction

## Returns

`true` if the join was performed, `false` otherwise

## Example

```typescript
// Bind to a key for joining blocks downward
const keymap = {
  "Alt-ArrowDown": joinDown,
};

// Use in a menu item
const menuItem = {
  label: "Join with block below",
  run: joinDown,
};
```
