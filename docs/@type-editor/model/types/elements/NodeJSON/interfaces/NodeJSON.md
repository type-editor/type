[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/model](../../../../README.md) / [types/elements/NodeJSON](../README.md) / NodeJSON

# Interface: NodeJSON

Defined in: [packages/model/src/types/elements/NodeJSON.ts:8](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/model/src/types/elements/NodeJSON.ts#L8)

JSON representation of a node, used for serialization and deserialization.

## Extended by

- [`TextNodeJSON`](../../TextNodeJSON/interfaces/TextNodeJSON.md)

## Properties

| Property                                 | Type                                                   | Description                             | Defined in                                                                                                                                                                              |
| ---------------------------------------- | ------------------------------------------------------ | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-attrs"></a> `attrs?`     | [`Attrs`](../../../schema/Attrs/type-aliases/Attrs.md) | The node's attributes, if any.          | [packages/model/src/types/elements/NodeJSON.ts:17](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/model/src/types/elements/NodeJSON.ts#L17) |
| <a id="property-content"></a> `content?` | `NodeJSON`[]                                           | The node's child nodes, if any.         | [packages/model/src/types/elements/NodeJSON.ts:22](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/model/src/types/elements/NodeJSON.ts#L22) |
| <a id="property-marks"></a> `marks?`     | [`MarkJSON`](../../MarkJSON/interfaces/MarkJSON.md)[]  | The marks applied to this node, if any. | [packages/model/src/types/elements/NodeJSON.ts:27](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/model/src/types/elements/NodeJSON.ts#L27) |
| <a id="property-text"></a> `text?`       | `string`                                               | For text nodes, the text content.       | [packages/model/src/types/elements/NodeJSON.ts:32](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/model/src/types/elements/NodeJSON.ts#L32) |
| <a id="property-type"></a> `type?`       | `string`                                               | The name of the node type.              | [packages/model/src/types/elements/NodeJSON.ts:12](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/model/src/types/elements/NodeJSON.ts#L12) |
