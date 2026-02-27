[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [input/handle-key-down](../README.md) / handleKeyDown

# Variable: handleKeyDown()

```ts
const handleKeyDown: (view, event) => boolean;
```

Defined in: [tables/src/input/handle-key-down.ts:36](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/tables/src/input/handle-key-down.ts#L36)

Keydown handler for table-related keyboard shortcuts.

Handles the following key bindings:

- Arrow keys: Navigate between cells.
- Shift+Arrow keys: Extend cell selection.
- Backspace/Delete: Delete selected cells' content.

## Parameters

| Parameter | Type            |
| --------- | --------------- |
| `view`    | `PmEditorView`  |
| `event`   | `KeyboardEvent` |

## Returns

`boolean`

## Example

```typescript
// Use in a ProseMirror plugin
new Plugin({
  props: {
    handleKeyDown: handleKeyDown,
  },
});
```
