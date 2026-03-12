[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/drag-drop/drag-end-handler](../README.md) / dragEndHandler

# Function: dragEndHandler()

```ts
function dragEndHandler(view): boolean;
```

Defined in: [input-handler/drag-drop/drag-end-handler.ts:11](https://github.com/type-editor/type/blob/99c78b8d1f93eef5c6a5bbfe09ed0a72a4c9ab4c/packages/input/src/input-handler/drag-drop/drag-end-handler.ts#L11)

Handles dragend events. Clears the dragging state after a short delay
to ensure drop events are processed first.

## Parameters

| Parameter | Type           |
| --------- | -------------- |
| `view`    | `PmEditorView` |

## Returns

`boolean`
