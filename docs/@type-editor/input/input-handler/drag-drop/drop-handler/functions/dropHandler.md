[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/drag-drop/drop-handler](../README.md) / dropHandler

# Function: dropHandler()

```ts
function dropHandler(view, event): boolean;
```

Defined in: [input-handler/drag-drop/drop-handler.ts:16](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/input/src/input-handler/drag-drop/drop-handler.ts#L16)

Handles drop events. Delegates to handleDrop and ensures dragging
state is cleared even if handling fails.

## Parameters

| Parameter | Type           |
| --------- | -------------- |
| `view`    | `PmEditorView` |
| `event`   | `Event`        |

## Returns

`boolean`
