[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/drag-drop/drag-end-handler](../README.md) / dragEndHandler

# Function: dragEndHandler()

```ts
function dragEndHandler(view): boolean;
```

Defined in: [input-handler/drag-drop/drag-end-handler.ts:11](https://github.com/type-editor/type/blob/aa914636446ba41d4acaa23bd67323cc71b1ac08/packages/input/src/input-handler/drag-drop/drag-end-handler.ts#L11)

Handles dragend events. Clears the dragging state after a short delay
to ensure drop events are processed first.

## Parameters

| Parameter | Type           |
| --------- | -------------- |
| `view`    | `PmEditorView` |

## Returns

`boolean`
