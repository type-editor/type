[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [commands/split-cell](../README.md) / splitCell

# Function: splitCell()

```ts
function splitCell(state, dispatch?): boolean;
```

Defined in: [tables/src/commands/split-cell.ts:19](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/commands/split-cell.ts#L19)

Splits a selected cell that has rowspan or colspan greater than one into smaller cells.

Uses the first cell's type for all new cells created during the split.

## Parameters

| Parameter   | Type               | Description                                       |
| ----------- | ------------------ | ------------------------------------------------- |
| `state`     | `PmEditorState`    | The current editor state                          |
| `dispatch?` | `DispatchFunction` | Optional dispatch function to execute the command |

## Returns

`boolean`

True if the command is applicable, false otherwise
