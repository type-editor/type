[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/model](../../../../README.md) / [types/content-parser/ContentMatch](../README.md) / MatchEdge

# Interface: MatchEdge

Defined in: [packages/model/src/types/content-parser/ContentMatch.ts:22](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/content-parser/ContentMatch.ts#L22)

Represents an edge in the content match finite automaton.
Each edge connects a node type to the next match state.

In the content matching system, edges define valid transitions between states.
For example, if a paragraph can contain text, there would be an edge from the
paragraph's content match to another state with the text node type.

## Example

```typescript
// An edge might represent: "paragraph node" -> "next state after paragraph"
const edge: MatchEdge = {
  type: schema.nodes.paragraph,
  next: someContentMatch,
};
```

## Properties

| Property                          | Type                                                          | Description                                                                                                   | Defined in                                                                                                                                                                                                  |
| --------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-next"></a> `next` | [`ContentMatch`](ContentMatch.md)                             | The next match state after matching this node type. Following this edge leads to this state in the automaton. | [packages/model/src/types/content-parser/ContentMatch.ts:33](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/content-parser/ContentMatch.ts#L33) |
| <a id="property-type"></a> `type` | [`NodeType`](../../../../schema/NodeType/classes/NodeType.md) | The node type that this edge represents. This is the type of node that can be matched at this transition.     | [packages/model/src/types/content-parser/ContentMatch.ts:27](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/content-parser/ContentMatch.ts#L27) |
