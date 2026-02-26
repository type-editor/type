[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/tables](../../../../README.md) / [types/commands/MoveTableRowOptions](../README.md) / MoveTableRowOptions

# Interface: MoveTableRowOptions

Defined in: [tables/src/types/commands/MoveTableRowOptions.ts:5](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/commands/MoveTableRowOptions.ts#L5)

Options for moveTableRow

## Properties

| Property                               | Type      | Description                                                                           | Defined in                                                                                                                                                                                             |
| -------------------------------------- | --------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="property-from"></a> `from`      | `number`  | The source row index to move from.                                                    | [tables/src/types/commands/MoveTableRowOptions.ts:9](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/commands/MoveTableRowOptions.ts#L9)   |
| <a id="property-pos"></a> `pos?`       | `number`  | Optional position to resolve table from. If not provided, uses the current selection. | [tables/src/types/commands/MoveTableRowOptions.ts:26](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/commands/MoveTableRowOptions.ts#L26) |
| <a id="property-select"></a> `select?` | `boolean` | Whether to select the moved row after the operation. **Default** `true`               | [tables/src/types/commands/MoveTableRowOptions.ts:21](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/commands/MoveTableRowOptions.ts#L21) |
| <a id="property-to"></a> `to`          | `number`  | The destination row index to move to.                                                 | [tables/src/types/commands/MoveTableRowOptions.ts:14](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/commands/MoveTableRowOptions.ts#L14) |
