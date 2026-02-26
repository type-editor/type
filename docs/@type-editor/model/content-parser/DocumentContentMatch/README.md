[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/model](../../README.md) / content-parser/DocumentContentMatch

# content-parser/DocumentContentMatch

## Classes

<table>
<thead>
<tr>
<th>Class</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[DocumentContentMatch](classes/DocumentContentMatch.md)

</td>
<td>

Instances of this class represent a match state of a node type's
[content expression](#model.NodeSpec.content), and can be used to
find out whether further content matches here, and whether a given
position is a valid end of the node.

The content match system uses a finite automaton approach where each
ContentMatch instance represents a state, and edges represent possible
node types that can be matched at that state.

## Finite Automaton Model

Content expressions (like "paragraph+" or "heading | paragraph\*") are compiled
into a finite automaton where:

- Each state (ContentMatch) represents a position in parsing the expression
- Edges represent valid node types that can appear at that position
- Valid end states indicate where content can legally terminate

## Common Operations

- **Matching**: Check if a node type or fragment can appear at this position
- **Filling**: Find what nodes to insert to make invalid content valid
- **Wrapping**: Find how to wrap a node to make it fit at this position
- **Validation**: Check if content satisfies the content expression

**Example**

```typescript
// Check if a paragraph can appear at this position
const nextMatch = contentMatch.matchType(schema.nodes.paragraph);
if (nextMatch) {
  console.log("Paragraph is valid here");
}

// Fill before a fragment to make it valid
const toInsert = contentMatch.fillBefore(fragment);
if (toInsert) {
  // Insert these nodes before the fragment
}

// Find wrapping for a node
const wrapping = contentMatch.findWrapping(schema.nodes.list_item);
if (wrapping) {
  // Wrap the node in these node types (outermost first)
}
```

</td>
</tr>
</tbody>
</table>
