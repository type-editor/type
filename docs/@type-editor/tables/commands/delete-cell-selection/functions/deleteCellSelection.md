[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [commands/delete-cell-selection](../README.md) / deleteCellSelection

# Function: deleteCellSelection()

```ts
function deleteCellSelection(state, dispatch?): boolean;
```

Defined in: [tables/src/commands/delete-cell-selection.ts:19](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/tables/src/commands/delete-cell-selection.ts#L19)

Deletes the content of selected cells while preserving the cell structure.

Only applies when there is a CellSelection. Replaces each cell's content
with the default empty content for a cell.

## Parameters

| Parameter   | Type               | Description                                       |
| ----------- | ------------------ | ------------------------------------------------- |
| `state`     | `PmEditorState`    | The current editor state                          |
| `dispatch?` | `DispatchFunction` | Optional dispatch function to execute the command |

## Returns

`boolean`

True if the selection is a CellSelection, false otherwise
