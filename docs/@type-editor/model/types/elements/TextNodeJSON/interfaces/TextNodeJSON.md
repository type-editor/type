[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/model](../../../../README.md) / [types/elements/TextNodeJSON](../README.md) / TextNodeJSON

# Interface: TextNodeJSON

Defined in: [packages/model/src/types/elements/TextNodeJSON.ts:7](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/model/src/types/elements/TextNodeJSON.ts#L7)

JSON representation of a text node.

## Extends

- [`NodeJSON`](../../NodeJSON/interfaces/NodeJSON.md)

## Properties

| Property                                   | Type                                                   | Description                                                     | Inherited from                                                                                                          | Defined in                                                                                                                                                                                      |
| ------------------------------------------ | ------------------------------------------------------ | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-attrs"></a> `attrs?`       | [`Attrs`](../../../schema/Attrs/type-aliases/Attrs.md) | The node's attributes, if any.                                  | [`NodeJSON`](../../NodeJSON/interfaces/NodeJSON.md).[`attrs`](../../NodeJSON/interfaces/NodeJSON.md#property-attrs)     | [packages/model/src/types/elements/NodeJSON.ts:17](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/model/src/types/elements/NodeJSON.ts#L17)         |
| <a id="property-content"></a> `content?`   | [`NodeJSON`](../../NodeJSON/interfaces/NodeJSON.md)[]  | The node's child nodes, if any.                                 | [`NodeJSON`](../../NodeJSON/interfaces/NodeJSON.md).[`content`](../../NodeJSON/interfaces/NodeJSON.md#property-content) | [packages/model/src/types/elements/NodeJSON.ts:22](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/model/src/types/elements/NodeJSON.ts#L22)         |
| <a id="property-marks"></a> `marks?`       | [`MarkJSON`](../../MarkJSON/interfaces/MarkJSON.md)[]  | The marks applied to this node, if any.                         | [`NodeJSON`](../../NodeJSON/interfaces/NodeJSON.md).[`marks`](../../NodeJSON/interfaces/NodeJSON.md#property-marks)     | [packages/model/src/types/elements/NodeJSON.ts:27](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/model/src/types/elements/NodeJSON.ts#L27)         |
| <a id="property-text"></a> `text?`         | `string`                                               | For text nodes, the text content.                               | [`NodeJSON`](../../NodeJSON/interfaces/NodeJSON.md).[`text`](../../NodeJSON/interfaces/NodeJSON.md#property-text)       | [packages/model/src/types/elements/NodeJSON.ts:32](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/model/src/types/elements/NodeJSON.ts#L32)         |
| <a id="property-type"></a> `type?`         | `string`                                               | The name of the node type.                                      | [`NodeJSON`](../../NodeJSON/interfaces/NodeJSON.md).[`type`](../../NodeJSON/interfaces/NodeJSON.md#property-type)       | [packages/model/src/types/elements/NodeJSON.ts:12](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/model/src/types/elements/NodeJSON.ts#L12)         |
| <a id="property-withtext"></a> `withText?` | `string`                                               | Alternative text content (used in some serialization contexts). | -                                                                                                                       | [packages/model/src/types/elements/TextNodeJSON.ts:11](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/model/src/types/elements/TextNodeJSON.ts#L11) |
