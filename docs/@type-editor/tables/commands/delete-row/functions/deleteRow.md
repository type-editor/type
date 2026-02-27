[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [commands/delete-row](../README.md) / deleteRow

# Function: deleteRow()

```ts
function deleteRow(state, dispatch?): boolean;
```

Defined in: [tables/src/commands/delete-row.ts:22](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/tables/src/commands/delete-row.ts#L22)

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
