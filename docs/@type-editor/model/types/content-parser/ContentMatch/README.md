[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/model](../../../README.md) / types/content-parser/ContentMatch

# types/content-parser/ContentMatch

## Interfaces

<table>
<thead>
<tr>
<th>Interface</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[ContentMatch](interfaces/ContentMatch.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[MatchEdge](interfaces/MatchEdge.md)

</td>
<td>

Represents an edge in the content match finite automaton.
Each edge connects a node type to the next match state.

In the content matching system, edges define valid transitions between states.
For example, if a paragraph can contain text, there would be an edge from the
paragraph's content match to another state with the text node type.

**Example**

```typescript
// An edge might represent: "paragraph node" -> "next state after paragraph"
const edge: MatchEdge = {
  type: schema.nodes.paragraph,
  next: someContentMatch,
};
```

</td>
</tr>
</tbody>
</table>
