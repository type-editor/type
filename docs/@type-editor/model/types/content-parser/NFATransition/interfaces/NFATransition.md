[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/model](../../../../README.md) / [types/content-parser/NFATransition](../README.md) / NFATransition

# Interface: NFATransition

Defined in: [packages/model/src/types/content-parser/NFATransition.ts:7](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/content-parser/NFATransition.ts#L7)

Represents an edge in the Non-deterministic Finite Automaton (NFA).
An edge connects one state to another, optionally labeled with a node type.

## Properties

| Property                          | Type                                                          | Description                                                                        | Defined in                                                                                                                                                                                                    |
| --------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-term"></a> `term` | [`NodeType`](../../../../schema/NodeType/classes/NodeType.md) | The node type required to traverse this edge, or undefined for epsilon transitions | [packages/model/src/types/content-parser/NFATransition.ts:10](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/content-parser/NFATransition.ts#L10) |
| <a id="property-to"></a> `to`     | `number`                                                      | The target state index, or undefined if not yet connected                          | [packages/model/src/types/content-parser/NFATransition.ts:13](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/content-parser/NFATransition.ts#L13) |
