[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/tables](../../../../README.md) / [types/copypaste/Area](../README.md) / Area

# Interface: Area

Defined in: [tables/src/types/copypaste/Area.ts:9](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/types/copypaste/Area.ts#L9)

Represents a rectangular area of table cells.

This structure is used to represent a block of cells that can be
copied, pasted, or manipulated as a unit.

## Properties

| Property                              | Type         | Description                                                            | Defined in                                                                                                                                                                 |
| ------------------------------------- | ------------ | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-height"></a> `height` | `number`     | The number of rows in the area (accounting for rowspan).               | [tables/src/types/copypaste/Area.ts:13](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/types/copypaste/Area.ts#L13) |
| <a id="property-rows"></a> `rows`     | `Fragment`[] | The rows of cells, where each row is a Fragment containing cell nodes. | [tables/src/types/copypaste/Area.ts:15](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/types/copypaste/Area.ts#L15) |
| <a id="property-width"></a> `width`   | `number`     | The number of columns in the area (accounting for colspan).            | [tables/src/types/copypaste/Area.ts:11](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/types/copypaste/Area.ts#L11) |
