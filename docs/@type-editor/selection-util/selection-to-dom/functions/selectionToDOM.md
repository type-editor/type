[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/selection-util](../../README.md) / [selection-to-dom](../README.md) / selectionToDOM

# Function: selectionToDOM()

```ts
function selectionToDOM(view, force?): void;
```

Defined in: [selection-to-dom.ts:42](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/selection-util/src/selection/selection-to-dom.ts#L42)

Synchronizes the ProseMirror selection to the DOM.

This function updates the browser's selection to match the current ProseMirror
selection state. It handles various edge cases including:

- Node selections
- Delayed drag selections in Chrome
- Broken selection behavior in Safari/older Chrome
- Cursor wrappers for special cases
- Selection visibility

## Parameters

| Parameter | Type           | Default value | Description                                              |
| --------- | -------------- | ------------- | -------------------------------------------------------- |
| `view`    | `PmEditorView` | `undefined`   | The editor view to synchronize                           |
| `force`   | `boolean`      | `false`       | Whether to force the selection update even if not needed |

## Returns

`void`
