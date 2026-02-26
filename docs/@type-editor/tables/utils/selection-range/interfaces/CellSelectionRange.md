[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/selection-range](../README.md) / CellSelectionRange

# Interface: CellSelectionRange

Defined in: [tables/src/utils/selection-range.ts:13](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/utils/selection-range.ts#L13)

Represents a rectangular selection range within a table.

This interface describes the anchor and head positions for a cell selection,
along with the indexes of all columns or rows included in the selection.

## Properties

| Property                                | Type          | Description                                                                                                                                              | Defined in                                                                                                                                                                   |
| --------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-anchor"></a> `$anchor`  | `ResolvedPos` | The resolved position of the selection anchor (where the selection started).                                                                             | [tables/src/utils/selection-range.ts:17](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/utils/selection-range.ts#L17) |
| <a id="property-head"></a> `$head`      | `ResolvedPos` | The resolved position of the selection head (where the selection ended).                                                                                 | [tables/src/utils/selection-range.ts:22](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/utils/selection-range.ts#L22) |
| <a id="property-indexes"></a> `indexes` | `number`[]    | An array of column or row indexes included in the selection. For column selections, these are column indexes; for row selections, these are row indexes. | [tables/src/utils/selection-range.ts:28](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/utils/selection-range.ts#L28) |
