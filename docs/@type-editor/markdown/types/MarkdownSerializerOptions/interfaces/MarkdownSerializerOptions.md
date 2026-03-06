[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/markdown](../../../README.md) / [types/MarkdownSerializerOptions](../README.md) / MarkdownSerializerOptions

# Interface: MarkdownSerializerOptions

Defined in: [types/MarkdownSerializerOptions.ts:11](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/types/MarkdownSerializerOptions.ts#L11)

## Extends

- [`MarkdownSerializeOptions`](MarkdownSerializeOptions.md)

## Properties

| Property                                                             | Type      | Description                                                                                                                                                                                              | Inherited from                                                                                                            | Defined in                                                                                                                                                                              |
| -------------------------------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-escapeextracharacters"></a> `escapeExtraCharacters?` | `RegExp`  | Extra characters can be added for escaping. This is passed directly to String.replace(), and the matching characters are preceded by a backslash.                                                        | -                                                                                                                         | [types/MarkdownSerializerOptions.ts:17](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/types/MarkdownSerializerOptions.ts#L17) |
| <a id="property-hardbreaknodename"></a> `hardBreakNodeName?`         | `string`  | Specify the node name of hard breaks. Defaults to "hard_break"                                                                                                                                           | -                                                                                                                         | [types/MarkdownSerializerOptions.ts:22](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/types/MarkdownSerializerOptions.ts#L22) |
| <a id="property-strict"></a> `strict?`                               | `boolean` | By default, the serializer raises an error when it finds a node or mark type for which no serializer is defined. Set this to `false` to make it just ignore such elements, rendering only their content. | -                                                                                                                         | [types/MarkdownSerializerOptions.ts:29](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/types/MarkdownSerializerOptions.ts#L29) |
| <a id="property-tightlists"></a> `tightLists?`                       | `boolean` | Whether to render lists in a tight style. This can be overridden on a node level by specifying a tight attribute on the node. Defaults to false.                                                         | [`MarkdownSerializeOptions`](MarkdownSerializeOptions.md).[`tightLists`](MarkdownSerializeOptions.md#property-tightlists) | [types/MarkdownSerializerOptions.ts:8](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/types/MarkdownSerializerOptions.ts#L8)   |
