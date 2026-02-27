[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/history](../../../README.md) / [commands/undo-no-scroll](../README.md) / undoNoScroll

# Variable: undoNoScroll

```ts
const undoNoScroll: Command;
```

Defined in: [commands/undo-no-scroll.ts:15](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/history/src/commands/undo-no-scroll.ts#L15)

A command function that undoes the last change without scrolling the
selection into view.

This is useful when you want to undo changes programmatically without
disrupting the user's current viewport position.

## Returns

A command that can be executed against an editor state
