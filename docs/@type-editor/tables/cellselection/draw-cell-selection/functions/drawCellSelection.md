[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [cellselection/draw-cell-selection](../README.md) / drawCellSelection

# Function: drawCellSelection()

```ts
function drawCellSelection(state): DecorationSource;
```

Defined in: [tables/src/cellselection/draw-cell-selection.ts:23](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/cellselection/draw-cell-selection.ts#L23)

Creates decorations to visually highlight selected cells in the editor.

This function is typically used as part of a ProseMirror plugin's decorations
to apply the 'selectedCell' CSS class to all cells within a CellSelection.

## Parameters

| Parameter | Type            | Description               |
| --------- | --------------- | ------------------------- |
| `state`   | `PmEditorState` | The current editor state. |

## Returns

`DecorationSource`

A DecorationSource containing node decorations for selected cells,
or `null` if the current selection is not a CellSelection.

## Example

```typescript
// In a plugin's props.decorations:
decorations: (state) => drawCellSelection(state);
```
