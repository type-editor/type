[**Type Editor**](../../README.md)

---

[Type Editor](../../index.md) / @type-editor/markdown

# @type-editor/markdown

This is a refactored version of the [prosemirror-markdown](https://github.com/ProseMirror/prosemirror-markdown) module.

This module defines a parser and serializer for
[CommonMark](http://commonmark.org/) text. It allows converting between
Markdown text and ProseMirror documents, enabling Markdown-based editing
workflows.

## Installation

```bash
npm install @type-editor/markdown
```

## Schema

The module provides a schema for CommonMark documents that includes standard
block elements (paragraphs, headings, blockquotes, code blocks, lists) and
inline elements (text, images, hard breaks) along with marks for emphasis,
strong, links, and code.

```typescript
import { schema } from "@type-editor/markdown";

// Use the markdown schema for your editor
const state = EditorState.create({
  schema: schema,
});
```

## Parsing Markdown

The `MarkdownParser` class converts Markdown text into ProseMirror documents.
It uses [markdown-it](https://github.com/markdown-it/markdown-it) to tokenize
the text and then applies custom rules to create the document tree.

### Using the Default Parser

```typescript
import { defaultMarkdownParser } from "@type-editor/markdown";

// Parse markdown text into a ProseMirror document
const doc = defaultMarkdownParser.parse(
  "# Hello World\n\nThis is **bold** text.",
);
```

### Creating a Custom Parser

```typescript
import { MarkdownParser } from "@type-editor/markdown";
import { Schema } from "@type-editor/model";
import MarkdownIt from "markdown-it";

const myParser = new MarkdownParser(
  mySchema,
  MarkdownIt("commonmark", { html: false }),
  {
    // Token specifications
    paragraph: { block: "paragraph" },
    heading: {
      block: "heading",
      getAttrs: (token) => ({ level: +token.tag.slice(1) }),
    },
    // ... more token specs
  },
);

const doc = myParser.parse("# Custom parsing");
```

### ParseSpec

The `ParseSpec` interface defines how markdown-it tokens are mapped to
ProseMirror nodes and marks:

- `node` - Maps to a single node of the specified type
- `block` - Wraps content in a block node (uses `_open`/`_close` token variants)
- `mark` - Adds a mark to the content
- `attrs` - Static attributes for the node or mark
- `getAttrs` - Function to compute attributes from the token
- `noCloseToken` - Indicates the token has no `_open`/`_close` variants

## Serializing to Markdown

The `MarkdownSerializer` class converts ProseMirror documents back to
Markdown text.

### Using the Default Serializer

```typescript
import { defaultMarkdownSerializer } from "@type-editor/markdown";

// Serialize a ProseMirror document to markdown
const markdown = defaultMarkdownSerializer.serialize(doc);
```

### Creating a Custom Serializer

```typescript
import { MarkdownSerializer } from "@type-editor/markdown";

const mySerializer = new MarkdownSerializer(
  {
    // Node serializers
    paragraph(state, node) {
      state.renderInline(node);
      state.closeBlock(node);
    },
    heading(state, node) {
      state.write(state.repeat("#", node.attrs.level) + " ");
      state.renderInline(node, false);
      state.closeBlock(node);
    },
    // ... more node serializers
  },
  {
    // Mark serializers
    strong: {
      open: "**",
      close: "**",
      mixable: true,
      expelEnclosingWhitespace: true,
    },
    em: {
      open: "*",
      close: "*",
      mixable: true,
      expelEnclosingWhitespace: true,
    },
    // ... more mark serializers
  },
);

const markdown = mySerializer.serialize(doc);
```

### MarkdownSerializerState

The `MarkdownSerializerState` class tracks state during serialization and
provides helper methods for writing markdown output:

- `write(content)` - Write content to the output
- `text(text, escape)` - Write text, optionally escaping special characters
- `renderInline(node)` - Render inline content of a node
- `renderContent(node)` - Render all content of a node
- `closeBlock(node)` - Close a block node
- `wrapBlock(delim, firstDelim, node, f)` - Wrap content in block delimiters
- `renderList(node, delim, firstDelim)` - Render a list structure
- `esc(str)` - Escape special markdown characters
- `repeat(str, n)` - Repeat a string n times

## Supported Elements

The default schema and serializers support the following CommonMark elements:

### Block Elements

- Paragraphs
- Headings (levels 1-6)
- Blockquotes
- Code blocks (fenced with ```)
- Horizontal rules
- Ordered lists
- Bullet lists
- List items

### Inline Elements

- Text
- Images
- Hard breaks

### Marks

- **Strong** (bold)
- _Emphasis_ (italic)
- `Code` (inline code)
- [Links](https://example.com)

## API Reference

### Exports

```typescript
// Schema
export { schema } from "./schema";

// Parsing
export { MarkdownParser } from "./from-markdown/MarkdownParser";
export { defaultMarkdownParser } from "./from-markdown/default-markdown-parser";
export { markdownToPmNodesSchema } from "./from-markdown/schema/markdown-to-pm-nodes-schema";

// Serializing
export { MarkdownSerializer } from "./to-markdown/MarkdownSerializer";
export { MarkdownSerializerState } from "./to-markdown/MarkdownSerializerState";
export { defaultMarkdownSerializer } from "./to-markdown/default-markdown-serializer";
export { markdownSchemaNodes } from "./to-markdown/schema/markdown-schema-nodes";
export { markdownSchemaMarks } from "./to-markdown/schema/markdown-schema-marks";

// Types
export type { ParseSpec } from "./types/ParseSpec";
```

## License

MIT

## Modules

<table>
<thead>
<tr>
<th>Module</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[from-markdown/default-markdown-parser](from-markdown/default-markdown-parser/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[from-markdown/MarkdownParser](from-markdown/MarkdownParser/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[from-markdown/MarkdownParseState](from-markdown/MarkdownParseState/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[from-markdown/schema/markdown-to-pm-nodes-schema](from-markdown/schema/markdown-to-pm-nodes-schema/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[schema](schema/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[to-markdown/default-markdown-serializer](to-markdown/default-markdown-serializer/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[to-markdown/MarkdownSerializer](to-markdown/MarkdownSerializer/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[to-markdown/MarkdownSerializerState](to-markdown/MarkdownSerializerState/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[to-markdown/schema/markdown-schema-marks](to-markdown/schema/markdown-schema-marks/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[to-markdown/schema/markdown-schema-nodes](to-markdown/schema/markdown-schema-nodes/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/MarkdownSerializerOptions](types/MarkdownSerializerOptions/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/MarkSerializerSpec](types/MarkSerializerSpec/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/NodeSerializerFunc](types/NodeSerializerFunc/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/ParseSpec](types/ParseSpec/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/StackElement](types/StackElement/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/TokenHandler](types/TokenHandler/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
</tbody>
</table>
