[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [input/handle-paste](../README.md) / handlePaste

# Function: handlePaste()

```ts
function handlePaste(view, _, slice): boolean;
```

Defined in: [tables/src/input/handle-paste.ts:41](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/input/handle-paste.ts#L41)

Handles paste events within table cells.

This function handles two scenarios:

1. When pasting into a cell selection, it clips the pasted content to fit
   the selected area and inserts cells appropriately.
2. When pasting table-like content into a single cell, it expands the
   table if necessary to accommodate the pasted cells.

## Parameters

| Parameter | Type             | Description                                                          |
| --------- | ---------------- | -------------------------------------------------------------------- |
| `view`    | `PmEditorView`   | The editor view.                                                     |
| `_`       | `ClipboardEvent` | The clipboard event (unused, but required by the handler signature). |
| `slice`   | `Slice`          | The pasted content as a ProseMirror slice.                           |

## Returns

`boolean`

`true` if the paste was handled, `false` to let default handling continue.

## Example

```typescript
// Use in a ProseMirror plugin
new Plugin({
  props: {
    handlePaste: handlePaste,
  },
});
```
