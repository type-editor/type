[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/drag-drop/drop-handler](../README.md) / dropHandler

# Function: dropHandler()

```ts
function dropHandler(view, event): boolean;
```

Defined in: [input-handler/drag-drop/drop-handler.ts:16](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/input/src/input-handler/drag-drop/drop-handler.ts#L16)

Handles drop events. Delegates to handleDrop and ensures dragging
state is cleared even if handling fails.

## Parameters

| Parameter | Type           |
| --------- | -------------- |
| `view`    | `PmEditorView` |
| `event`   | `Event`        |

## Returns

`boolean`
