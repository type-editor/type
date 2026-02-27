[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/drag-drop/drag-end-handler](../README.md) / dragEndHandler

# Function: dragEndHandler()

```ts
function dragEndHandler(view): boolean;
```

Defined in: [input-handler/drag-drop/drag-end-handler.ts:11](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/input/src/input-handler/drag-drop/drag-end-handler.ts#L11)

Handles dragend events. Clears the dragging state after a short delay
to ensure drop events are processed first.

## Parameters

| Parameter | Type           |
| --------- | -------------- |
| `view`    | `PmEditorView` |

## Returns

`boolean`
