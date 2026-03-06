[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/move-row](../README.md) / MoveRowParams

# Interface: MoveRowParams

Defined in: [tables/src/utils/move-row.ts:14](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/utils/move-row.ts#L14)

Parameters for moving a row within a table.

## Properties

| Property                                        | Type            | Description                                                                   | Defined in                                                                                                                                                     |
| ----------------------------------------------- | --------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-originindex"></a> `originIndex` | `number`        | The zero-based index of the row to move.                                      | [tables/src/utils/move-row.ts:23](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/utils/move-row.ts#L23) |
| <a id="property-pos"></a> `pos`                 | `number`        | A document position within the table. Used to locate the table node.          | [tables/src/utils/move-row.ts:38](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/utils/move-row.ts#L38) |
| <a id="property-select"></a> `select`           | `boolean`       | Whether to select the moved row after the operation completes.                | [tables/src/utils/move-row.ts:33](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/utils/move-row.ts#L33) |
| <a id="property-targetindex"></a> `targetIndex` | `number`        | The zero-based index of the target position where the row should be moved to. | [tables/src/utils/move-row.ts:28](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/utils/move-row.ts#L28) |
| <a id="property-transaction"></a> `transaction` | `PmTransaction` | The transaction to apply the row move operation to.                           | [tables/src/utils/move-row.ts:18](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/utils/move-row.ts#L18) |
