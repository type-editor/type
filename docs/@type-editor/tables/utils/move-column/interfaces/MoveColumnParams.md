[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/move-column](../README.md) / MoveColumnParams

# Interface: MoveColumnParams

Defined in: [tables/src/utils/move-column.ts:15](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/utils/move-column.ts#L15)

Parameters for moving a column within a table.

## Properties

| Property                                        | Type            | Description                                                                      | Defined in                                                                                                                                                           |
| ----------------------------------------------- | --------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-originindex"></a> `originIndex` | `number`        | The zero-based index of the column to move.                                      | [tables/src/utils/move-column.ts:24](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/utils/move-column.ts#L24) |
| <a id="property-pos"></a> `pos`                 | `number`        | A position within the table. Used to locate the table node in the document.      | [tables/src/utils/move-column.ts:39](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/utils/move-column.ts#L39) |
| <a id="property-select"></a> `select`           | `boolean`       | Whether to select the moved column after the operation completes.                | [tables/src/utils/move-column.ts:34](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/utils/move-column.ts#L34) |
| <a id="property-targetindex"></a> `targetIndex` | `number`        | The zero-based index of the target position where the column should be moved to. | [tables/src/utils/move-column.ts:29](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/utils/move-column.ts#L29) |
| <a id="property-tr"></a> `tr`                   | `PmTransaction` | The transaction to apply the column move operation to.                           | [tables/src/utils/move-column.ts:19](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/utils/move-column.ts#L19) |
