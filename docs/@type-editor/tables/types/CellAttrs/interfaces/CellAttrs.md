[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [types/CellAttrs](../README.md) / CellAttrs

# Interface: CellAttrs

Defined in: [tables/src/types/CellAttrs.ts:6](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/types/CellAttrs.ts#L6)

Represents the attributes of a table cell node.

These attributes control cell spanning behavior and column widths.

## Properties

| Property                                  | Type       | Description                                           | Defined in                                                                                                                                                       |
| ----------------------------------------- | ---------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-colspan"></a> `colspan`   | `number`   | Number of columns this cell spans. Default is 1.      | [tables/src/types/CellAttrs.ts:8](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/types/CellAttrs.ts#L8)   |
| <a id="property-colwidth"></a> `colwidth` | `number`[] | Array of column widths in pixels, or null if not set. | [tables/src/types/CellAttrs.ts:12](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/types/CellAttrs.ts#L12) |
| <a id="property-rowspan"></a> `rowspan`   | `number`   | Number of rows this cell spans. Default is 1.         | [tables/src/types/CellAttrs.ts:10](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/types/CellAttrs.ts#L10) |
