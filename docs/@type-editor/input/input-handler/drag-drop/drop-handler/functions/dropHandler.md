[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/drag-drop/drop-handler](../README.md) / dropHandler

# Function: dropHandler()

```ts
function dropHandler(view, event): boolean;
```

Defined in: [input-handler/drag-drop/drop-handler.ts:16](https://github.com/type-editor/type/blob/99c78b8d1f93eef5c6a5bbfe09ed0a72a4c9ab4c/packages/input/src/input-handler/drag-drop/drop-handler.ts#L16)

Handles drop events. Delegates to handleDrop and ensures dragging
state is cleared even if handling fails.

## Parameters

| Parameter | Type           |
| --------- | -------------- |
| `view`    | `PmEditorView` |
| `event`   | `Event`        |

## Returns

`boolean`
