[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/drag-drop/drop-handler](../README.md) / dropHandler

# Function: dropHandler()

```ts
function dropHandler(view, event): boolean;
```

Defined in: [input-handler/drag-drop/drop-handler.ts:16](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/input/src/input-handler/drag-drop/drop-handler.ts#L16)

Handles drop events. Delegates to handleDrop and ensures dragging
state is cleared even if handling fails.

## Parameters

| Parameter | Type           |
| --------- | -------------- |
| `view`    | `PmEditorView` |
| `event`   | `Event`        |

## Returns

`boolean`
