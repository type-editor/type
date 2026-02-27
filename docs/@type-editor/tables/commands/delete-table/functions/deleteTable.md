[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [commands/delete-table](../README.md) / deleteTable

# Function: deleteTable()

```ts
function deleteTable(state, dispatch?): boolean;
```

Defined in: [tables/src/commands/delete-table.ts:15](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/tables/src/commands/delete-table.ts#L15)

Deletes the table containing the current selection.

Traverses up the document structure to find and delete the enclosing table.

## Parameters

| Parameter   | Type               | Description                                       |
| ----------- | ------------------ | ------------------------------------------------- |
| `state`     | `PmEditorState`    | The current editor state                          |
| `dispatch?` | `DispatchFunction` | Optional dispatch function to execute the command |

## Returns

`boolean`

True if a table was found and deleted, false otherwise
