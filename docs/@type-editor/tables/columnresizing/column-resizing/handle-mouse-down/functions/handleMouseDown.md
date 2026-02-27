[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/tables](../../../../README.md) / [columnresizing/column-resizing/handle-mouse-down](../README.md) / handleMouseDown

# Function: handleMouseDown()

```ts
function handleMouseDown(
  view,
  event,
  cellMinWidth,
  defaultCellMinWidth,
): boolean;
```

Defined in: [tables/src/columnresizing/column-resizing/handle-mouse-down.ts:28](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/columnresizing/column-resizing/handle-mouse-down.ts#L28)

Handles mouse down events to initiate column resizing when clicking on an
active resize handle.

Sets up event listeners for mouse movement and mouse up to handle the
drag operation. During dragging, the column width is visually updated.
When dragging completes, the final width is applied to the document.

## Parameters

| Parameter             | Type           | Description                                                 |
| --------------------- | -------------- | ----------------------------------------------------------- |
| `view`                | `PmEditorView` | The editor view.                                            |
| `event`               | `MouseEvent`   | The mouse event.                                            |
| `cellMinWidth`        | `number`       | The minimum width a column can be resized to.               |
| `defaultCellMinWidth` | `number`       | The default minimum width for cells without explicit width. |

## Returns

`boolean`

`true` if the event was handled (a resize drag was started), `false` otherwise.
