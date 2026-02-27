[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/history](../../../README.md) / [commands/redo-no-scroll](../README.md) / redoNoScroll

# Variable: redoNoScroll

```ts
const redoNoScroll: Command;
```

Defined in: [commands/redo-no-scroll.ts:14](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/history/src/commands/redo-no-scroll.ts#L14)

A command function that redoes the last undone change without scrolling
the selection into view.

This is useful when you want to redo changes programmatically without
disrupting the user's current viewport position.

## Returns

A command that can be executed against an editor state
