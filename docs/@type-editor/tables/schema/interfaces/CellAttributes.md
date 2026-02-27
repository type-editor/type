[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / [schema](../README.md) / CellAttributes

# Interface: CellAttributes

Defined in: [tables/src/schema.ts:143](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/tables/src/schema.ts#L143)

Configuration for a custom cell attribute.

Custom cell attributes allow extending table cells with additional
properties that are persisted in the document and serialized to HTML.

## Properties

| Property                                       | Type                                          | Description                                                                                                                                                                                                                                                                                      | Defined in                                                                                                                                       |
| ---------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="property-default"></a> `default`        | `unknown`                                     | The attribute's default value. This value is used when the attribute is not explicitly set.                                                                                                                                                                                                      | [tables/src/schema.ts:148](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/tables/src/schema.ts#L148) |
| <a id="property-getfromdom"></a> `getFromDOM?` | [`getFromDOM`](../type-aliases/getFromDOM.md) | A function to read the attribute's value from a DOM element. Called during HTML parsing to extract the attribute value. Should return the parsed value, or null if not present.                                                                                                                  | [tables/src/schema.ts:166](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/tables/src/schema.ts#L166) |
| <a id="property-setdomattr"></a> `setDOMAttr?` | [`setDOMAttr`](../type-aliases/setDOMAttr.md) | A function to add the attribute's value to a DOM attributes object. Called during HTML serialization to write the attribute. Should modify the attrs object in place.                                                                                                                            | [tables/src/schema.ts:174](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/tables/src/schema.ts#L174) |
| <a id="property-validate"></a> `validate?`     | `string` \| (`value`) => `void`               | A function or type name used to validate values of this attribute. Can be a string like "number" or "string" for simple type validation, or a function that throws an error if validation fails. **See** [AttributeSpec.validate](https://prosemirror.net/docs/ref/#model.AttributeSpec.validate | ProseMirror)                                                                                                                                     | [tables/src/schema.ts:158](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/tables/src/schema.ts#L158) |
