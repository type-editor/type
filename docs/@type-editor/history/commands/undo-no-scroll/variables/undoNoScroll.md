[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/history](../../../README.md) / [commands/undo-no-scroll](../README.md) / undoNoScroll

# Variable: undoNoScroll

```ts
const undoNoScroll: Command;
```

Defined in: [commands/undo-no-scroll.ts:15](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/history/src/commands/undo-no-scroll.ts#L15)

A command function that undoes the last change without scrolling the
selection into view.

This is useful when you want to undo changes programmatically without
disrupting the user's current viewport position.

## Returns

A command that can be executed against an editor state
