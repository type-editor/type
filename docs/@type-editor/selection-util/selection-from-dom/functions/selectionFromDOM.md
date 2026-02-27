[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/selection-util](../../README.md) / [selection-from-dom](../README.md) / selectionFromDOM

# Function: selectionFromDOM()

```ts
function selectionFromDOM(view, origin?): PmSelection;
```

Defined in: [selection-from-dom.ts:24](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/selection-util/src/selection/selection-from-dom.ts#L24)

Converts a DOM selection to a ProseMirror Selection.

This function reads the current browser selection and translates it into
a ProseMirror selection that can be used with the editor state. It handles
various edge cases including collapsed selections, node selections, and
multi-range selections.

## Parameters

| Parameter | Type           | Default value | Description                                                              |
| --------- | -------------- | ------------- | ------------------------------------------------------------------------ |
| `view`    | `PmEditorView` | `undefined`   | The editor view containing the DOM and document state                    |
| `origin`  | `string`       | `null`        | Optional string indicating the origin of the selection (e.g., 'pointer') |

## Returns

`PmSelection`

A ProseMirror Selection object, or null if the selection is invalid or no focus node exists
