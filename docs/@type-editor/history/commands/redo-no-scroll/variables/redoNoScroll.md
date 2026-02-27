[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/history](../../../README.md) / [commands/redo-no-scroll](../README.md) / redoNoScroll

# Variable: redoNoScroll

```ts
const redoNoScroll: Command;
```

Defined in: [commands/redo-no-scroll.ts:14](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/history/src/commands/redo-no-scroll.ts#L14)

A command function that redoes the last undone change without scrolling
the selection into view.

This is useful when you want to redo changes programmatically without
disrupting the user's current viewport position.

## Returns

A command that can be executed against an editor state
