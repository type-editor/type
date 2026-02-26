[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [commands/set-cell-attr](../README.md) / setCellAttr

# Function: setCellAttr()

```ts
function setCellAttr(name, value): Command;
```

Defined in: [tables/src/commands/set-cell-attr.ts:20](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/commands/set-cell-attr.ts#L20)

Creates a command that sets a specific attribute to a given value on the selected cell(s).

The command is only available when the currently selected cell doesn't
already have that attribute set to the specified value.

## Parameters

| Parameter | Type      | Description                       |
| --------- | --------- | --------------------------------- |
| `name`    | `string`  | The attribute name to set         |
| `value`   | `unknown` | The value to set the attribute to |

## Returns

`Command`

A command that sets the attribute on selected cells
