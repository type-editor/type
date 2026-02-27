[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / [schema](../README.md) / TableNodesOptions

# Interface: TableNodesOptions

Defined in: [tables/src/schema.ts:180](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/schema.ts#L180)

Options for configuring table node specifications.

## Properties

| Property                                              | Type                                                            | Description                                                                                                                                                                                                                                                                      | Defined in                                                                                                                                       |
| ----------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="property-cellattributes"></a> `cellAttributes` | `Record`&lt;`string`, [`CellAttributes`](CellAttributes.md)&gt; | Additional custom attributes to add to cell nodes. Maps attribute names to their configuration objects. These attributes will be available on both table_cell and table_header nodes. **Example** `{ background: { default: null, getFromDOM: (dom) => dom.style.backgroundColor |                                                                                                                                                  | null, setDOMAttr: (value, attrs) => { if (value) attrs.style = `background-color: ${value}`; } } }` | [tables/src/schema.ts:218](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/schema.ts#L218) |
| <a id="property-cellcontent"></a> `cellContent`       | `string`                                                        | The content expression for table cells. Defines what content is allowed inside table cells. **Examples** `"block+" - One or more block elements` `"paragraph+" - One or more paragraphs`                                                                                         | [tables/src/schema.ts:199](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/schema.ts#L199) |
| <a id="property-tablegroup"></a> `tableGroup?`        | `string`                                                        | A group name to add to the table node type. This allows the table to be included in content expressions. Common values include "block" to allow tables where block content is expected. **Example** `"block"`                                                                    | [tables/src/schema.ts:189](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/schema.ts#L189) |
