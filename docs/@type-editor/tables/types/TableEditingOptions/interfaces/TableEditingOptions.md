[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [types/TableEditingOptions](../README.md) / TableEditingOptions

# Interface: TableEditingOptions

Defined in: [tables/src/types/TableEditingOptions.ts:2](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/tables/src/types/TableEditingOptions.ts#L2)

## Properties

| Property                                                                 | Type      | Description                                                                                                                                                                                                                                              | Defined in                                                                                                                                                                           |
| ------------------------------------------------------------------------ | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="property-allowtablenodeselection"></a> `allowTableNodeSelection?` | `boolean` | Whether to allow table node selection. By default, any node selection wrapping a table will be converted into a CellSelection wrapping all cells in the table. You can pass `true` to allow the selection to remain a NodeSelection. **Default** `false` | [tables/src/types/TableEditingOptions.ts:12](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/tables/src/types/TableEditingOptions.ts#L12) |
