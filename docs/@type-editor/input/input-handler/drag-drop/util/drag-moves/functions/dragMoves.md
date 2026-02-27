[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/input](../../../../../README.md) / [input-handler/drag-drop/util/drag-moves](../README.md) / dragMoves

# Function: dragMoves()

```ts
function dragMoves(view, event): boolean;
```

Defined in: [input-handler/drag-drop/util/drag-moves.ts:12](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/input/src/input-handler/drag-drop/util/drag-moves.ts#L12)

Determines whether a drag operation should be a move (vs. copy).
Checks dragCopies prop and drag modifier key state.

## Parameters

| Parameter | Type           | Description     |
| --------- | -------------- | --------------- |
| `view`    | `PmEditorView` | The editor view |
| `event`   | `DragEvent`    | The drag event  |

## Returns

`boolean`

True if the drag should move content
