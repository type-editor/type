[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/model](../../README.md) / dom-parser/DOMParser

# dom-parser/DOMParser

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

[DOMParser](classes/DOMParser.md)

</td>
<td>

A DOM parser represents a strategy for parsing DOM content into a
ProseMirror document conforming to a given schema. Its behavior is
defined by an array of [rules](#model.ParseRule).

The parser processes DOM nodes and converts them into ProseMirror document nodes
based on the configured parse rules. It supports both tag-based rules (matching
DOM elements by selector) and style-based rules (matching CSS properties).

**Example**

```typescript
// Create a parser from a schema
const parser = DOMParser.fromSchema(mySchema);

// Parse a DOM element
const doc = parser.parse(domElement);

// Parse a slice (for partial content)
const slice = parser.parseSlice(domElement);
```

</td>
</tr>
</tbody>
</table>
