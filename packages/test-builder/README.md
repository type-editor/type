# @type-editor/test-builder

This largely corresponds the [prosemirror-test-builder](https://github.com/ProseMirror/prosemirror-test-builder) module.

Test helper utilities for Type Editor packages. This module provides builder functions for creating document nodes and marks in tests, along with JSDOM mocks for testing in Node.js environments.

## Installation

```bash
npm install @type-editor/test-builder
```

## Overview

The test-builder module simplifies the creation of document structures in tests. Instead of manually constructing nodes and fragments, you can use intuitive builder functions that mirror your document structure.

## Exports

### Pre-configured Builders

The module exports pre-configured builders for common node and mark types:

```typescript
import { doc, p, h1, h2, h3, strong, em, code, a, ul, ol, li, blockquote, br, hr, img, pre } from '@type-editor/test-builder';

// Create a simple document
const myDoc = doc(
  h1('Hello World'),
  p('This is a ', strong('bold'), ' and ', em('italic'), ' text.'),
  ul(
    li(p('First item')),
    li(p('Second item'))
  )
);
```

### Node Builders

| Builder              | Description                    |
|----------------------|--------------------------------|
| `doc`                | Document root node             |
| `p`                  | Paragraph                      |
| `h1`, `h2`, `h3`     | Headings (levels 1-3)          |
| `pre` / `code_block` | Code block                     |
| `blockquote`         | Block quote                    |
| `ul`                 | Bullet (unordered) list        |
| `ol`                 | Ordered list                   |
| `li`                 | List item                      |
| `br`                 | Hard break                     |
| `hr`                 | Horizontal rule                |
| `img`                | Image (default src: 'img.png') |

### Mark Builders

| Builder  | Description                |
|----------|----------------------------|
| `strong` | Bold text                  |
| `em`     | Italic text                |
| `code`   | Inline code                |
| `a`      | Link (default href: 'foo') |

### Position Tags

You can mark positions in your document using angle-bracket syntax for testing selections and cursors:

```typescript
import { doc, p } from '@type-editor/test-builder';

const myDoc = doc(p('Hello <a>world<b>!'));
// myDoc.tag.a === position before 'world'
// myDoc.tag.b === position after 'world'
```

### Custom Builders

Create builders for your own schema:

```typescript
import { builders, type NodeBuilder, type MarkBuilder } from '@type-editor/test-builder';
import { mySchema } from './my-schema';

const b = builders(mySchema, {
  // Define aliases with default attributes
  note: { nodeType: 'note', level: 'info' },
  warning: { nodeType: 'note', level: 'warning' },
  mention: { markType: 'mention', userId: '123' }
});

const myDoc = b.doc(
  b.note('This is an info note'),
  b.warning('This is a warning')
);
```

### Schema

The module exports a pre-configured schema with common nodes and marks:

```typescript
import { schema } from '@type-editor/test-builder';

// Use the schema directly
const node = schema.nodes.paragraph.create({}, schema.text('Hello'));
```

It also exports the basic schema components:

```typescript
import * as bSchema from '@type-editor/test-builder';

// Access prosemirror-schema-basic compatible exports
const { nodes, marks } = bSchema.bSchema;
```

### Equality Helper

A utility function for comparing nodes:

```typescript
import { eq, doc, p } from '@type-editor/test-builder';

const doc1 = doc(p('Hello'));
const doc2 = doc(p('Hello'));

eq(doc1, doc2); // true
```

### JSDOM Mocks

For tests running in JSDOM (Node.js), the module provides mocks for DOM methods not implemented by JSDOM:

```typescript
import { setupJSDOMMocks } from '@type-editor/test-builder';

describe('My Editor Tests', () => {
  setupJSDOMMocks();

  it('should handle text positioning', () => {
    // Tests that use getClientRects() or getBoundingClientRect()
    // will work with the mocked implementations
  });
});
```

The mocks provide minimal implementations for:
- `Range.prototype.getClientRects()`
- `Range.prototype.getBoundingClientRect()`
- `Element.prototype.getClientRects()`

## API Reference

### `builders(schema, names?)`

Creates a set of builder functions for a given schema.

**Parameters:**
- `schema`: The document schema to create builders for
- `names` (optional): An object mapping alias names to node/mark configurations

**Returns:** An object with builder functions for each node and mark type in the schema, plus any aliases defined in `names`.

### `NodeBuilder`

A function type for building nodes:

```typescript
type NodeBuilder = (
  attrsOrFirstChild?: Attrs | ChildSpec,
  ...children: ChildSpec[]
) => Node & { tag: Tags };
```

### `MarkBuilder`

A function type for building marked content:

```typescript
type MarkBuilder = (
  attrsOrFirstChild?: Attrs | ChildSpec,
  ...children: ChildSpec[]
) => ChildSpec;
```

### `FlattenedNodes`

Represents a sequence of nodes with optional position tags:

```typescript
interface FlattenedNodes {
  flat: ReadonlyArray<Node>;
  tag?: Record<string, number>;
}
```

## License

MIT

