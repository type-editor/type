[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/tables](../../../../README.md) / [columnresizing/column-resizing/handle-decorations](../README.md) / handleDecorations

# Function: handleDecorations()

```ts
function handleDecorations(state, cell): DecorationSet;
```

Defined in: [tables/src/columnresizing/column-resizing/handle-decorations.ts:20](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/tables/src/columnresizing/column-resizing/handle-decorations.ts#L20)

Creates decorations for the column resize handle at the specified cell position.
This includes a widget decoration for the resize handle itself and optionally
a node decoration with a dragging class when actively resizing.

## Parameters

| Parameter | Type            | Description                                                              |
| --------- | --------------- | ------------------------------------------------------------------------ |
| `state`   | `PmEditorState` | The current editor state.                                                |
| `cell`    | `number`        | The document position of the cell where the resize handle should appear. |

## Returns

`DecorationSet`

A DecorationSet containing the resize handle decorations.
