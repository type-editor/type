[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [commands/delete-column](../README.md) / deleteColumn

# Function: deleteColumn()

```ts
function deleteColumn(state, dispatch?): boolean;
```

Defined in: [tables/src/commands/delete-column.ts:22](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/commands/delete-column.ts#L22)

Command that removes the selected columns from a table.

If the selection spans multiple columns, all selected columns will be removed.
The command will not execute if it would remove all columns in the table.

## Parameters

| Parameter   | Type               | Description                                       |
| ----------- | ------------------ | ------------------------------------------------- |
| `state`     | `PmEditorState`    | The current editor state                          |
| `dispatch?` | `DispatchFunction` | Optional dispatch function to execute the command |

## Returns

`boolean`

True if the command is applicable, false otherwise
