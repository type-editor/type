# @type-editor/schema

This is a refactored version of the [prosemirror-schema-basic](https://github.com/ProseMirror/prosemirror-schema-basic) and [prosemirror-schema-list](https://github.com/ProseMirror/prosemirror-schema-list) modules.

This module provides a basic ProseMirror-compatible document schema, combining node and mark definitions with list-related schema elements and commands. You can use the provided schema directly, extend it, or selectively use individual node and mark specs to build a custom schema.

Note: the original modules `schema-basic` and `schema-list` are included the `compat` package.

## Installation

```bash
npm install @type-editor/schema
```

## Basic Usage

```typescript
import { schema, nodes, marks } from '@type-editor/schema';
import { EditorState } from '@type-editor/state';

// Use the pre-built schema directly
const state = EditorState.create({ schema });

// Or create a custom schema using individual specs
import { Schema } from '@type-editor/model';

const customSchema = new Schema({
  nodes: {
    doc: nodes.doc,
    paragraph: nodes.paragraph,
    text: nodes.text,
    heading: nodes.heading,
  },
  marks: {
    strong: marks.strong,
    em: marks.em,
  },
});
```

## Schema

The module exports a pre-built `schema` that roughly corresponds to the document schema used by [CommonMark](http://commonmark.org/), minus the list elements (which can be added using `addListNodes`).

## Node Specs

The `nodes` object contains the following node specifications:

### Document Structure

- **doc** - The top-level document node with content `'block+'`
- **text** - A text node (inline group)

### Block Nodes

- **paragraph** - A plain paragraph textblock (`<p>`), supports `textAlign` attribute with values `'left'`, `'right'`, `'center'`, or `'justify'`
- **heading** - A heading textblock (`<h1>` to `<h6>`) with a `level` attribute (1-6)
- **blockquote** - A blockquote wrapper (`<blockquote>`) for one or more blocks
- **code_block** - A code listing (`<pre><code>`) that disallows marks
- **horizontal_rule** - A horizontal rule (`<hr>`)

### Inline Nodes

- **image** - An inline image (`<img>`) with `src`, `alt`, and `title` attributes
- **file** - An inline file link (`<a>`) with `href`, `name`, `lastModified`, `size`, `type`, and optional `previewImage` attributes
- **hard_break** - A hard line break (`<br>`)

## Mark Specs

The `marks` object contains the following mark specifications:

- **link** - A hyperlink (`<a>`) with `href` and `title` attributes
- **em** - Emphasis (`<em>`, also parses `<i>` and `font-style: italic`)
- **strong** - Strong text (`<strong>`, also parses `<b>` and `font-weight: bold`)
- **underline** - Underlined text (`<u>`, also parses `text-decoration: underline`)
- **strikethrough** - Strikethrough text (`<s>`, also parses `<del>`, `<strike>`)
- **subscript** - Subscript text (`<sub>`)
- **superscript** - Superscript text (`<sup>`)
- **highlight** - Highlighted/marked text (`<mark>`)
- **code** - Inline code (`<code>`)

## List Schema

The module provides list-related node specs that can be added to any schema:

### List Node Specs

- **orderedList** - An ordered list (`<ol>`) with an `order` attribute for the starting number
- **bulletList** - A bullet/unordered list (`<ul>`)
- **listItem** - A list item (`<li>`)

### Adding Lists to a Schema

Use the `addListNodes` helper function to add list support to your schema:

```typescript
import { addListNodes, orderedList, bulletList, listItem } from '@type-editor/schema';
import { Schema } from '@type-editor/model';

// Add list nodes to an existing OrderedMap of nodes
const myNodes = addListNodes(
  baseNodes,
  'paragraph block*',  // itemContent - content expression for list items
  'block'              // listGroup - group name for list node types
);

const schema = new Schema({ nodes: myNodes, marks });
```

## List Commands

The module exports several commands for working with lists:

### wrapInList

Wraps the current selection in a list of the specified type.

```typescript
import { wrapInList } from '@type-editor/schema';

// Wrap selection in a bullet list
const command = wrapInList(schema.nodes.bullet_list);
command(state, dispatch);

// Wrap selection in an ordered list starting at 5
const orderedCommand = wrapInList(schema.nodes.ordered_list, { order: 5 });
orderedCommand(state, dispatch);
```

### liftListItem

Lifts a list item up into its parent list, or out of the list entirely if already at the top level.

```typescript
import { liftListItem } from '@type-editor/schema';

const command = liftListItem(schema.nodes.list_item);
command(state, dispatch);
```

### sinkListItem

Sinks a list item into a nested list within the previous sibling list item.

```typescript
import { sinkListItem } from '@type-editor/schema';

const command = sinkListItem(schema.nodes.list_item);
command(state, dispatch);
```

### splitListItem

Splits the current list item at the cursor position, creating a new list item.

```typescript
import { splitListItem } from '@type-editor/schema';

const command = splitListItem(schema.nodes.list_item);
command(state, dispatch);
```

### splitListItemKeepMarks

Same as `splitListItem`, but preserves the active marks when splitting.

```typescript
import { splitListItemKeepMarks } from '@type-editor/schema';

const command = splitListItemKeepMarks(schema.nodes.list_item);
command(state, dispatch);
```

### wrapRangeInList

A lower-level function that wraps a specific node range in a list. Used internally by `wrapInList`.

```typescript
import { wrapRangeInList } from '@type-editor/schema';

const range = $from.blockRange($to);
wrapRangeInList(transaction, range, listType, attrs);
```

## API Reference

### Exports

| Export                   | Type       | Description                                         |
|--------------------------|------------|-----------------------------------------------------|
| `schema`                 | `Schema`   | Pre-built schema with basic nodes and marks         |
| `nodes`                  | `Object`   | Node specifications (doc, paragraph, heading, etc.) |
| `marks`                  | `Object`   | Mark specifications (link, em, strong, etc.)        |
| `orderedList`            | `NodeSpec` | Ordered list node spec                              |
| `bulletList`             | `NodeSpec` | Bullet list node spec                               |
| `listItem`               | `NodeSpec` | List item node spec                                 |
| `addListNodes`           | `Function` | Helper to add list nodes to a schema                |
| `wrapInList`             | `Function` | Command to wrap selection in a list                 |
| `liftListItem`           | `Function` | Command to lift list item                           |
| `sinkListItem`           | `Function` | Command to sink list item                           |
| `splitListItem`          | `Function` | Command to split list item                          |
| `splitListItemKeepMarks` | `Function` | Command to split list item preserving marks         |
| `wrapRangeInList`        | `Function` | Low-level function to wrap range in list            |

## License

MIT
