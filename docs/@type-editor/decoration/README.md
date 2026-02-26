[**Type Editor**](../../README.md)

---

[Type Editor](../../index.md) / @type-editor/decoration

# @type-editor/decoration

A refactored version of ProseMirror's [prosemirror-decoration](https://github.com/ProseMirror/prosemirror-decoration) system, providing a powerful way to add visual styling, attributes, and UI elements to the editor view without modifying the underlying document.

## Installation

```bash
npm install @type-editor/decoration
```

## Overview

Decorations allow you to enhance the visual presentation of your editor content without changing the document model. They are used for features like:

- **Syntax highlighting**: Apply styling to code elements
- **Search results**: Highlight matching text
- **Collaborative editing**: Show other users' cursors and selections
- **Spelling/grammar**: Mark errors or suggestions
- **Inline widgets**: Add buttons, mentions, or custom UI elements
- **Node styling**: Apply classes or attributes to block elements

Decorations are ephemeral—they exist only in the view layer and are managed through the [`decorations` prop](https://prosemirror.net/docs/ref/#view.EditorProps.decorations). They automatically update when the document changes through a mapping process.

## Decoration Types

### Inline Decorations

Inline decorations apply styling or attributes to a range of inline content. They render as inline elements (like `<span>`) wrapping the decorated content.

```typescript
import { Decoration } from "@type-editor/decoration";

// Highlight text from position 5 to 15
const highlight = Decoration.inline(5, 15, {
  class: "search-result",
  style: "background-color: yellow;",
});

// Mark a spelling error with data attributes
const spellError = Decoration.inline(20, 25, {
  class: "spelling-error",
  "data-suggestion": "correct",
});

// Control whether decorations expand when typing at boundaries
const expandable = Decoration.inline(
  30,
  40,
  { class: "comment" },
  { inclusiveStart: true, inclusiveEnd: true },
);
```

**Options:**

- `inclusiveStart`: Whether the decoration expands when content is inserted at the start (default: `false`)
- `inclusiveEnd`: Whether the decoration expands when content is inserted at the end (default: `false`)

### Widget Decorations

Widget decorations insert DOM nodes at specific positions without affecting the document model. They're perfect for inline UI elements.

```typescript
// Insert a button at position 10
const button = Decoration.widget(10, () => {
  const btn = document.createElement("button");
  btn.textContent = "Click me";
  btn.onclick = () => alert("Clicked!");
  return btn;
});

// Show a collaborative cursor
const cursor = Decoration.widget(
  50,
  () => {
    const el = document.createElement("span");
    el.className = "remote-cursor";
    el.style.borderLeft = "2px solid blue";
    return el;
  },
  { side: -1 },
); // Position before the cursor position

// Add a mention suggestion widget
const mention = Decoration.widget(
  100,
  (view, getPos) => {
    const el = document.createElement("span");
    el.className = "mention-widget";
    el.textContent = "@john";
    return el;
  },
  {
    side: 1,
    key: "mention-john", // Stable identity for efficient updates
  },
);
```

**Options:**

- `side`: Position relative to the specified position:
  - `-1`: Before the position
  - `0`: At the position (default)
  - `1`: After the position
- `key`: Stable identifier for the widget (helps with efficient updates)
- `stopEvent`: Function to intercept DOM events on the widget
- `ignoreSelection`: Whether to ignore selection when positioning

### Node Decorations

Node decorations apply styling or attributes to entire block nodes. They wrap the node's DOM representation.

```typescript
// Highlight a selected paragraph
const selectedPara = Decoration.node(5, 45, {
  class: "selected-node",
});

// Mark a code block with an error
const errorBlock = Decoration.node(100, 150, {
  class: "error-block",
  "data-error-type": "syntax",
  style: "border-left: 3px solid red;",
});
```

**Important:** Node decorations must span exactly one non-text node. The `from` position must be at the start of a node, and the `to` position must be at the end of that same node.

## DecorationSet

The `DecorationSet` class organizes decorations efficiently for use with the editor view. It's a persistent data structure that supports efficient updates when the document changes.

### Creating a DecorationSet

```typescript
import { DecorationSet } from "@type-editor/decoration";

// Create from an array of decorations
const decorations = [
  Decoration.inline(5, 15, { class: "highlight" }),
  Decoration.widget(20, () => document.createElement("button")),
  Decoration.node(30, 50, { class: "selected" }),
];

const decoSet = DecorationSet.create(doc, decorations);
```

### Updating Decorations

When the document changes, map decorations through the change:

```typescript
import { Mapping } from "@type-editor/transform";

// After a transaction
const mapping = transaction.mapping;
const newDecoSet = oldDecoSet.map(mapping, newDoc);
```

### Finding Decorations

```typescript
// Find all decorations in a range
const found = decoSet.find(10, 50);

// Find decorations at a specific position
const atPos = decoSet.find(25, 25);

// Find decorations with a specific spec property
const withKey = decoSet.find(
  undefined,
  undefined,
  (deco) => deco.spec.key === "my-widget",
);
```

### Adding and Removing Decorations

```typescript
// Add decorations
const newDecoSet = oldDecoSet.add(doc, [
  Decoration.inline(100, 110, { class: "new-highlight" }),
]);

// Remove decorations
const withoutDecoSet = oldDecoSet.remove(decorationsToRemove);
```

## Using Decorations in a Plugin

Decorations are typically managed through a plugin's state:

```typescript
import { Plugin } from "@type-editor/state";
import { Decoration, DecorationSet } from "@type-editor/decoration";

const highlightPlugin = new Plugin({
  state: {
    init(_, { doc }) {
      // Create initial decorations
      const decorations = findTextToHighlight(doc).map(({ from, to }) =>
        Decoration.inline(from, to, { class: "highlight" }),
      );
      return DecorationSet.create(doc, decorations);
    },
    apply(tr, oldSet) {
      // Map decorations through document changes
      let set = oldSet.map(tr.mapping, tr.doc);

      // Update decorations based on transaction metadata
      if (tr.getMeta("updateHighlights")) {
        const decorations = findTextToHighlight(tr.doc).map(({ from, to }) =>
          Decoration.inline(from, to, { class: "highlight" }),
        );
        set = DecorationSet.create(tr.doc, decorations);
      }

      return set;
    },
  },
  props: {
    decorations(state) {
      return this.getState(state);
    },
  },
});
```

## Advanced Usage

### Dynamic Widget Content

Widgets can access the editor view and their position:

```typescript
const dynamicWidget = Decoration.widget(pos, (view, getPos) => {
  const el = document.createElement("div");

  // Access current position (may change as document is edited)
  const currentPos = getPos();

  // Access view to dispatch transactions
  el.onclick = () => {
    view.dispatch(view.state.tr.insertText("Clicked!", currentPos));
  };

  return el;
});
```

### Event Handling in Widgets

Control how events are handled on widget elements:

```typescript
const interactiveWidget = Decoration.widget(
  pos,
  () => {
    const el = document.createElement("input");
    return el;
  },
  {
    stopEvent: (event) => {
      // Return true to prevent ProseMirror from handling this event
      return event.type === "mousedown" || event.type === "keydown";
    },
  },
);
```

### Efficient Updates with Keys

Use keys to help ProseMirror identify widgets across updates:

```typescript
// Without keys, widgets are recreated on every update
const withoutKey = Decoration.widget(pos, () => createComplexWidget());

// With keys, ProseMirror can reuse the same DOM node
const withKey = Decoration.widget(pos, () => createComplexWidget(), {
  key: "user-123-cursor",
});
```

## API Reference

### Decoration

Static methods for creating decorations:

- `Decoration.widget(pos, toDOM, spec?)`: Create a widget decoration
- `Decoration.inline(from, to, attrs, spec?)`: Create an inline decoration
- `Decoration.node(from, to, attrs, spec?)`: Create a node decoration

Instance properties:

- `from`: Start position
- `to`: End position
- `type`: Decoration type object
- `spec`: The specification object used to create the decoration

Instance methods:

- `eq(other, offset?)`: Check if two decorations are equal
- `copy(from, to)`: Create a copy with new positions
- `map(mapping, offset, oldOffset)`: Map through a document change

### DecorationSet

Static methods:

- `DecorationSet.create(doc, decorations)`: Create a decoration set from an array
- `DecorationSet.empty`: Empty decoration set constant

Instance methods:

- `find(from?, to?, predicate?)`: Find decorations in a range
- `map(mapping, doc, options?)`: Map through document changes
- `add(doc, decorations)`: Add decorations
- `remove(decorations)`: Remove decorations

### DecorationGroup

Helper for managing multiple decoration sources:

```typescript
import { DecorationGroup } from "@type-editor/decoration";

const group = DecorationGroup.from([decoSet1, decoSet2, decoSet3]);
```

## Performance Considerations

1. **Use keys for widgets**: Assign stable keys to widget decorations to avoid unnecessary DOM recreation
2. **Minimize decoration count**: Large numbers of decorations can impact performance
3. **Batch updates**: Update decorations together rather than one at a time
4. **Use appropriate types**: Choose the simplest decoration type for your use case
5. **Efficient mapping**: The decoration set efficiently maps through changes, but creating new sets is relatively expensive

## Compatibility

This module is a refactored version of ProseMirror's decoration system. While the API is nearly identical, TypeScript type definitions may differ slightly. For full ProseMirror compatibility, use the `@type-editor-compat/decoration` package.

## Related Modules

- `@type-editor/view`: The view module that renders decorations
- `@type-editor/state`: State management for decoration plugins
- `@type-editor/transform`: Provides the mapping system for updating decorations

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

[decoration/AbstractDecorationSource](decoration/AbstractDecorationSource/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[decoration/AbstractDecorationType](decoration/AbstractDecorationType/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[decoration/Decoration](decoration/Decoration/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[decoration/DecorationFactory](decoration/DecorationFactory/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[decoration/DecorationGroup](decoration/DecorationGroup/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[decoration/DecorationSet](decoration/DecorationSet/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[decoration/InlineType](decoration/InlineType/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[decoration/NodeType](decoration/NodeType/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[decoration/view-decorations](decoration/view-decorations/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[decoration/WidgetType](decoration/WidgetType/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/decoration/DecorationAttrs](types/decoration/DecorationAttrs/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/decoration/WidgetConstructor](types/decoration/WidgetConstructor/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
</tbody>
</table>
