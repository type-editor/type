# @type-editor/model

This is a refactored version of the [prosemirror-model](https://github.com/ProseMirror/prosemirror-model) module.

This module defines ProseMirror's content model, the data structures
used to represent and work with documents. It provides the foundation
for building rich-text editors by implementing the document tree structure,
schemas that define valid document content, and utilities for parsing
and serializing DOM content.

## Installation

```bash
npm install @type-editor/model
```

## Document Structure

A ProseMirror document is a tree. At each level, a [node](#model.Node)
describes the type of the content, and holds a
[fragment](#model.Fragment) containing its children.

Nodes are persistent data structures. Instead of changing them, you
create new ones with the content you want. Old ones keep pointing
at the old document shape. This is made cheaper by sharing
structure between the old and new data as much as possible.

**Do not** directly mutate the properties of a `Node` object. See
[the guide](https://prosemirror.net/docs/guide/#doc) for more information.


## Resolved Positions

Positions in a document can be represented as integer
[offsets](https://prosemirror.net/docs/guide/#doc.indexing). But you'll often want to use a
more convenient representation that provides context information about
the position within the document tree.

A resolved position knows its parent node, its position within that
parent, and provides access to ancestor nodes at any depth.

## Document Schema

Every ProseMirror document conforms to a
[schema](https://prosemirror.net/docs/guide/#schema), which describes the set of nodes and
marks that it is made out of, along with the relations between those,
such as which node may occur as a child node of which other nodes.

The schema defines:
- **Node types**: Block elements (paragraphs, headings, lists) and inline elements (text)
- **Mark types**: Formatting that can be applied to inline content (bold, italic, links)
- **Content expressions**: Rules for what content each node type can contain
- **Attributes**: Custom data that can be attached to nodes and marks

## DOM Representation

Because representing a document as a tree of DOM nodes is central to
the way ProseMirror operates, DOM [parsing](#model.DOMParser) and
[serializing](#model.DOMSerializer) is integrated with the model.

The `DOMParser` converts HTML/DOM content into ProseMirror documents,
while `DOMSerializer` converts ProseMirror documents back to DOM nodes.

(Note that you do _not_ need to have a DOM implementation loaded
to use the core parts of this module.)

## Usage Examples

### Creating a Schema

```typescript
import { Schema } from '@type-editor/model';

const schema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: { 
      content: 'inline*', 
      group: 'block',
      toDOM: () => ['p', 0]
    },
    text: { group: 'inline' }
  },
  marks: {
    bold: {
      toDOM: () => ['strong', 0],
      parseDOM: [{ tag: 'strong' }, { tag: 'b' }]
    }
  }
});
```

### Creating Document Nodes

```typescript
// Create a text node
const textNode = schema.text('Hello, world!');

// Create a paragraph with text
const paragraph = schema.nodes.paragraph.create(null, textNode);

// Create a document
const doc = schema.nodes.doc.create(null, paragraph);
```

### Working with Positions

```typescript
// Resolve a position to get context
const $pos = doc.resolve(5);

// Access parent node
const parent = $pos.parent;

// Get depth in the tree
const depth = $pos.depth;

// Navigate to ancestors
const grandparent = $pos.node(depth - 1);
```

### Parsing and Serializing DOM

```typescript
import { DOMParser, DOMSerializer } from '@type-editor/model';

// Parse HTML into a document
const parser = DOMParser.fromSchema(schema);
const doc = parser.parse(domElement);

// Serialize document to DOM
const serializer = DOMSerializer.fromSchema(schema);
const domNode = serializer.serializeFragment(doc.content);
```

## API Reference

For detailed API documentation, see the [ProseMirror Reference Manual](https://prosemirror.net/docs/ref/#model).

## License

MIT
