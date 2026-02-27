[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [lift](../README.md) / lift

# Variable: lift

```ts
const lift: Command;
```

Defined in: [lift.ts:43](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/commands/src/lift.ts#L43)

Lifts the selected block out of its parent node.

This command takes the selected block (or the closest ancestor block containing
the selection) and moves it one level up in the document hierarchy by removing
its parent wrapper. This is commonly used to:

- Remove items from lists
- Unwrap content from blockquotes
- Decrease indentation levels
- Remove other wrapping structures

The command will only succeed if the lift operation is structurally valid
according to the schema (i.e., the parent node can be removed without
violating content constraints).

## Param

The current editor state

## Param

Optional dispatch function to execute the transaction

## Returns

`true` if the lift can be performed, `false` otherwise

## Example

```typescript
// Use in a keymap to lift blocks (e.g., outdent list items)
const keymap = {
  "Mod-[": lift,
  "Shift-Tab": lift,
};

// Use in a menu
const menuItem = {
  label: "Lift out of parent",
  run: lift,
  enable: (state) => lift(state),
  icon: outdentIcon,
};
```
