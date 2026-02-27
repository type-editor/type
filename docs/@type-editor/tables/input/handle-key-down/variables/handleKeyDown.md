[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [input/handle-key-down](../README.md) / handleKeyDown

# Variable: handleKeyDown()

```ts
const handleKeyDown: (view, event) => boolean;
```

Defined in: [tables/src/input/handle-key-down.ts:36](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/input/handle-key-down.ts#L36)

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
