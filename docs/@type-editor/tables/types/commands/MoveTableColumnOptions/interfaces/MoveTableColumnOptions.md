[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/tables](../../../../README.md) / [types/commands/MoveTableColumnOptions](../README.md) / MoveTableColumnOptions

# Interface: MoveTableColumnOptions

Defined in: [tables/src/types/commands/MoveTableColumnOptions.ts:4](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/commands/MoveTableColumnOptions.ts#L4)

Options for moveTableColumn

## Properties

| Property                               | Type      | Description                                                                           | Defined in                                                                                                                                                                                                   |
| -------------------------------------- | --------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="property-from"></a> `from`      | `number`  | The source column index to move from.                                                 | [tables/src/types/commands/MoveTableColumnOptions.ts:8](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/commands/MoveTableColumnOptions.ts#L8)   |
| <a id="property-pos"></a> `pos?`       | `number`  | Optional position to resolve table from. If not provided, uses the current selection. | [tables/src/types/commands/MoveTableColumnOptions.ts:25](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/commands/MoveTableColumnOptions.ts#L25) |
| <a id="property-select"></a> `select?` | `boolean` | Whether to select the moved column after the operation. **Default** `true`            | [tables/src/types/commands/MoveTableColumnOptions.ts:20](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/commands/MoveTableColumnOptions.ts#L20) |
| <a id="property-to"></a> `to`          | `number`  | The destination column index to move to.                                              | [tables/src/types/commands/MoveTableColumnOptions.ts:13](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/commands/MoveTableColumnOptions.ts#L13) |
