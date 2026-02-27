[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [commands/delete-cell-selection](../README.md) / deleteCellSelection

# Function: deleteCellSelection()

```ts
function deleteCellSelection(state, dispatch?): boolean;
```

Defined in: [tables/src/commands/delete-cell-selection.ts:19](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/tables/src/commands/delete-cell-selection.ts#L19)

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
