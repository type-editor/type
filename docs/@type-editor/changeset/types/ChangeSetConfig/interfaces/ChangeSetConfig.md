[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/changeset](../../../README.md) / [types/ChangeSetConfig](../README.md) / ChangeSetConfig

# Interface: ChangeSetConfig&lt;Data&gt;

Defined in: [types/ChangeSetConfig.ts:11](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/changeset/src/types/ChangeSetConfig.ts#L11)

Configuration options for a ChangeSet.

## Type Parameters

| Type Parameter | Description                                   |
| -------------- | --------------------------------------------- |
| `Data`         | The type of metadata associated with changes. |

## Properties

| Property                                | Type                                                                         | Description                                                                     | Defined in                                                                                                                                                           |
| --------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-combine"></a> `combine` | (`dataA`, `dataB`) => `Data`                                                 | Function to combine metadata from adjacent spans. Returns null if incompatible. | [types/ChangeSetConfig.ts:15](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/changeset/src/types/ChangeSetConfig.ts#L15) |
| <a id="property-doc"></a> `doc`         | `Node_2`                                                                     | The starting document that changes are tracked from.                            | [types/ChangeSetConfig.ts:13](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/changeset/src/types/ChangeSetConfig.ts#L13) |
| <a id="property-encoder"></a> `encoder` | [`TokenEncoder`](../../TokenEncoder/interfaces/TokenEncoder.md)&lt;`any`&gt; | Encoder for tokenizing document content during diff operations.                 | [types/ChangeSetConfig.ts:17](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/changeset/src/types/ChangeSetConfig.ts#L17) |
