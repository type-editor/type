[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/query](../README.md) / FindNodeResult

# Interface: FindNodeResult

Defined in: [tables/src/utils/query.ts:28](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/utils/query.ts#L28)

Result of finding a parent node that matches a predicate.

This interface provides comprehensive information about a found node,
including its position in the document and its depth in the node tree.

## Properties

| Property                            | Type     | Description                                                                                                      | Defined in                                                                                                                                               |
| ----------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-depth"></a> `depth` | `number` | The depth of the node in the document tree. The root document has depth 0, and each nested level increases by 1. | [tables/src/utils/query.ts:50](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/utils/query.ts#L50) |
| <a id="property-node"></a> `node`   | `Node_2` | The closest parent node that satisfies the predicate.                                                            | [tables/src/utils/query.ts:32](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/utils/query.ts#L32) |
| <a id="property-pos"></a> `pos`     | `number` | The position directly before the node. For the root node (depth 0), this is always 0.                            | [tables/src/utils/query.ts:38](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/utils/query.ts#L38) |
| <a id="property-start"></a> `start` | `number` | The position at the start of the node's content. This is the position immediately after the opening of the node. | [tables/src/utils/query.ts:44](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/utils/query.ts#L44) |
