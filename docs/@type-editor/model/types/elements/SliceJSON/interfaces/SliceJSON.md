[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/model](../../../../README.md) / [types/elements/SliceJSON](../README.md) / SliceJSON

# Interface: SliceJSON

Defined in: [packages/model/src/types/elements/SliceJSON.ts:7](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/types/elements/SliceJSON.ts#L7)

JSON representation of a Slice for serialization.

## Properties

| Property                                     | Type                                                  | Description                                                               | Defined in                                                                                                                                                                                |
| -------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-content"></a> `content`      | [`NodeJSON`](../../NodeJSON/interfaces/NodeJSON.md)[] | The content nodes of the slice in JSON format.                            | [packages/model/src/types/elements/SliceJSON.ts:21](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/types/elements/SliceJSON.ts#L21) |
| <a id="property-openend"></a> `openEnd?`     | `number`                                              | The open depth at the end of the slice. Defaults to 0 if not specified.   | [packages/model/src/types/elements/SliceJSON.ts:16](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/types/elements/SliceJSON.ts#L16) |
| <a id="property-openstart"></a> `openStart?` | `number`                                              | The open depth at the start of the slice. Defaults to 0 if not specified. | [packages/model/src/types/elements/SliceJSON.ts:11](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/types/elements/SliceJSON.ts#L11) |
