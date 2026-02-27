[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [commands/add-row-after](../README.md) / addRowAfter

# Function: addRowAfter()

```ts
function addRowAfter(state, dispatch?): boolean;
```

Defined in: [tables/src/commands/add-row-after.ts:17](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/tables/src/commands/add-row-after.ts#L17)

Command to add a table row after the selection.

## Parameters

| Parameter   | Type               | Description                                       |
| ----------- | ------------------ | ------------------------------------------------- |
| `state`     | `PmEditorState`    | The current editor state                          |
| `dispatch?` | `DispatchFunction` | Optional dispatch function to execute the command |

## Returns

`boolean`

True if the command is applicable, false otherwise
