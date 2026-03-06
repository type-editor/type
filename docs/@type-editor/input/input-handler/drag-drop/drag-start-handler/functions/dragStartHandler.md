[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/drag-drop/drag-start-handler](../README.md) / dragStartHandler

# Function: dragStartHandler()

```ts
function dragStartHandler(view, event): boolean;
```

Defined in: [input-handler/drag-drop/drag-start-handler.ts:20](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/input/src/input-handler/drag-drop/drag-start-handler.ts#L20)

Handles dragstart events. Determines what content is being dragged
(selected content or a draggable node), serializes it, and sets up
the drag data transfer.

## Parameters

| Parameter | Type           |
| --------- | -------------- |
| `view`    | `PmEditorView` |
| `event`   | `DragEvent`    |

## Returns

`boolean`
