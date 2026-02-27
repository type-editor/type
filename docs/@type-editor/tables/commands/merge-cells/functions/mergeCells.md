[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [commands/merge-cells](../README.md) / mergeCells

# Function: mergeCells()

```ts
function mergeCells(state, dispatch?): boolean;
```

Defined in: [tables/src/commands/merge-cells.ts:29](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/tables/src/commands/merge-cells.ts#L29)

Merges the selected cells into a single cell.

This command is only available when:

- Multiple cells are selected via CellSelection
- The selected cells' outline forms a proper rectangle
- No cells partially overlap the selection boundary

The merged cell will contain the combined content of all merged cells.

## Parameters

| Parameter   | Type               | Description                                       |
| ----------- | ------------------ | ------------------------------------------------- |
| `state`     | `PmEditorState`    | The current editor state                          |
| `dispatch?` | `DispatchFunction` | Optional dispatch function to execute the command |

## Returns

`boolean`

True if the command is applicable, false otherwise
