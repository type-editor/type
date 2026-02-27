[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [commands/add-column-after](../README.md) / addColumnAfter

# Function: addColumnAfter()

```ts
function addColumnAfter(state, dispatch?): boolean;
```

Defined in: [tables/src/commands/add-column-after.ts:17](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/tables/src/commands/add-column-after.ts#L17)

Command to add a column after the column with the selection.

## Parameters

| Parameter   | Type               | Description                                       |
| ----------- | ------------------ | ------------------------------------------------- |
| `state`     | `PmEditorState`    | The current editor state                          |
| `dispatch?` | `DispatchFunction` | Optional dispatch function to execute the command |

## Returns

`boolean`

True if the command is applicable, false otherwise
