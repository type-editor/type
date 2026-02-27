[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/tables](../../../../README.md) / [columnresizing/column-resizing/handle-mouse-move](../README.md) / handleMouseMove

# Function: handleMouseMove()

```ts
function handleMouseMove(view, event, handleWidth, lastColumnResizable): void;
```

Defined in: [tables/src/columnresizing/column-resizing/handle-mouse-move.ts:21](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/tables/src/columnresizing/column-resizing/handle-mouse-move.ts#L21)

Handles mouse movement events to detect when the cursor is near a column edge
and should activate the resize handle.

## Parameters

| Parameter             | Type           | Description                                    |
| --------------------- | -------------- | ---------------------------------------------- |
| `view`                | `PmEditorView` | The editor view.                               |
| `event`               | `MouseEvent`   | The mouse event.                               |
| `handleWidth`         | `number`       | The width of the resize handle zone in pixels. |
| `lastColumnResizable` | `boolean`      | Whether the last column can be resized.        |

## Returns

`void`
