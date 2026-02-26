[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/decoration](../../README.md) / decoration/DecorationSet

# decoration/DecorationSet

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

[DecorationSet](classes/DecorationSet.md)

</td>
<td>

A collection of [decorations](#view.Decoration), organized in such
a way that the drawing algorithm can efficiently use and compare
them. This is a persistent data structure—it is not modified,
updates create a new value.

The decoration set organizes decorations hierarchically according to
the document structure, allowing for efficient updates when the document
changes. Decorations are stored both locally (applying to the current node)
and in child sets (applying to child nodes).

**Example**

```typescript
// Create a decoration set from decorations
const decorations = [Decoration.inline(0, 5, { class: "highlight" })];
const decoSet = DecorationSet.create(doc, decorations);

// Map through a document change
const mapped = decoSet.map(mapping, newDoc);

// Find decorations in a range
const found = decoSet.find(10, 20);
```

</td>
</tr>
</tbody>
</table>
