[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [commands/delete-row](../README.md) / deleteRow

# Function: deleteRow()

```ts
function deleteRow(state, dispatch?): boolean;
```

Defined in: [tables/src/commands/delete-row.ts:22](https://github.com/type-editor/type/blob/99c78b8d1f93eef5c6a5bbfe09ed0a72a4c9ab4c/packages/tables/src/commands/delete-row.ts#L22)

Command that removes the selected rows from a table.

If the selection spans multiple rows, all selected rows will be removed.
The command will not execute if it would remove all rows in the table.

## Parameters

| Parameter   | Type               | Description                                       |
| ----------- | ------------------ | ------------------------------------------------- |
| `state`     | `PmEditorState`    | The current editor state                          |
| `dispatch?` | `DispatchFunction` | Optional dispatch function to execute the command |

## Returns

`boolean`

True if the command is applicable, false otherwise
