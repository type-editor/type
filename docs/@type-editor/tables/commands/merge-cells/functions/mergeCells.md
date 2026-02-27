[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [commands/merge-cells](../README.md) / mergeCells

# Function: mergeCells()

```ts
function mergeCells(state, dispatch?): boolean;
```

Defined in: [tables/src/commands/merge-cells.ts:29](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/commands/merge-cells.ts#L29)

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
