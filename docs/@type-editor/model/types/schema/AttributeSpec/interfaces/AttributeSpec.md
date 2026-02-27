[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/model](../../../../README.md) / [types/schema/AttributeSpec](../README.md) / AttributeSpec

# Interface: AttributeSpec

Defined in: [packages/model/src/types/schema/AttributeSpec.ts:5](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/model/src/types/schema/AttributeSpec.ts#L5)

Used to [define](#model.NodeSpec.attrs) attributes on nodes or
marks.

## Properties

| Property                                   | Type                            | Description                                                                                                                                                                                                                                                                                                          | Defined in                                                                                                                                                                                    |
| ------------------------------------------ | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-default"></a> `default?`   | `any`                           | The default value for this attribute, to use when no explicit value is provided. Attributes that have no default must be provided whenever a node or mark of a type that has them is created.                                                                                                                        | [packages/model/src/types/schema/AttributeSpec.ts:13](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/model/src/types/schema/AttributeSpec.ts#L13) |
| <a id="property-validate"></a> `validate?` | `string` \| (`value`) => `void` | A function or type name used to validate values of this attribute. This will be used when deserializing the attribute from JSON, and when running [`Node.check`](#model.Node.check). When a function, it should raise an exception if the value isn't of the expected type or shape. When a string, it should be a ` | `-separated string of primitive types (`'number'`, `'string'`, `'boolean'`, `'null'`, and `'undefined'`), and the library will raise an error when the value is not one of those types.       | [packages/model/src/types/schema/AttributeSpec.ts:25](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/model/src/types/schema/AttributeSpec.ts#L25) |
