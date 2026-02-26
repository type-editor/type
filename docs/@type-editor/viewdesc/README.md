[**Type Editor**](../../README.md)

---

[Type Editor](../../index.md) / @type-editor/viewdesc

# @type-editor/viewdesc

A refactored version of ProseMirror's view description system, providing the core rendering engine that maintains a parallel tree structure between the document model and the DOM representation.

## Installation

```bash
npm install @type-editor/viewdesc
```

## Overview

The ViewDesc (View Description) system is the internal rendering layer that powers the Type Editor view. It creates and maintains a tree of descriptor objects that:

- **Mirror the document structure**: Each document node has a corresponding ViewDesc
- **Manage DOM nodes**: Create, update, and destroy DOM elements efficiently
- **Apply decorations**: Render visual enhancements without modifying the document
- **Map positions**: Convert between document positions and DOM coordinates
- **Handle updates**: Incrementally update the DOM when the document changes
- **Support custom rendering**: Allow developers to override node rendering

ViewDesc operates as an abstraction layer between the editor's document state and the browser's DOM, enabling efficient updates and sophisticated rendering capabilities.

## Core Concepts

### The Parallel Tree Structure

Type Editor maintains two parallel trees:

```
Document Tree (Model)          ViewDesc Tree                  DOM Tree
─────────────────────          ─────────────                  ────────
    doc                            DocViewDesc                   <div>
     │                                  │                          │
     ├─ paragraph                   NodeViewDesc               <p>
     │   └─ "Hello"                 └─ TextViewDesc            └─ "Hello"
     │
     ├─ blockquote                  NodeViewDesc               <blockquote>
     │   └─ paragraph               └─ NodeViewDesc            └─ <p>
     │       └─ "World"                 └─ TextViewDesc            └─ "World"
```

Each ViewDesc maintains:

- References to its DOM node(s)
- Knowledge of its document position
- Information about decorations
- Links to parent and child ViewDescs

### ViewDesc Types

The system includes several specialized ViewDesc types:

- **NodeViewDesc**: Represents document nodes (paragraphs, headings, lists, etc.)
- **TextViewDesc**: Represents text content within nodes
- **MarkViewDesc**: Represents inline marks (bold, italic, links)
- **WidgetViewDesc**: Represents decoration widgets (placeholders, UI elements)
- **CustomNodeViewDesc**: Represents user-defined custom node views
- **CompositionViewDesc**: Handles IME composition for complex text input
- **TrailingHackViewDesc**: Browser-specific compatibility fixes

## Key Components

### ViewDesc (Base Class)

The foundation class providing core functionality:

```typescript
import { ViewDesc } from "@type-editor/viewdesc";

// ViewDesc properties
viewDesc.dom; // The DOM node
viewDesc.contentDOM; // Where children are rendered
viewDesc.parent; // Parent ViewDesc
viewDesc.children; // Child ViewDescs
viewDesc.dirty; // Dirty state tracking
viewDesc.node; // Associated ProseMirror node

// Position mapping
const pos = viewDesc.posBeforeChild(childDesc);
const domPos = viewDesc.domFromPos(10, 1);
const docPos = viewDesc.localPosFromDOM(domNode, offset, bias);

// Lifecycle
viewDesc.destroy();
viewDesc.markDirty(from, to);
```

### NodeViewDesc

Represents actual document nodes with full support for decorations:

```typescript
import { NodeViewDesc } from "@type-editor/viewdesc";

// NodeViewDesc properties
nodeViewDesc.node; // The ProseMirror node
nodeViewDesc.outerDeco; // Decorations wrapping the node
nodeViewDesc.innerDeco; // Decorations inside the node
nodeViewDesc.nodeDOM; // The node's primary DOM element
nodeViewDesc.size; // Node size in the document
nodeViewDesc.border; // Border size (0 for leaves, 1 for blocks)

// Node matching for efficient updates
const matches = nodeViewDesc.matchesNode(node, outerDeco, innerDeco);

// Apply decorations
const decoratedDOM = NodeViewDesc.applyOuterDeco(dom, decorations, node);
```

### TextViewDesc

Represents text nodes with special handling for text content:

```typescript
import { TextViewDesc } from "@type-editor/viewdesc";

// TextViewDesc wraps text DOM nodes
const textDesc = new TextViewDesc(parent, node, outerDeco, innerDeco, dom);

// Efficiently updates text content
textDesc.node = newTextNode;
```

### MarkViewDesc

Represents inline marks that wrap text or other content:

```typescript
import { MarkViewDesc } from "@type-editor/viewdesc";

// MarkViewDesc wraps content with mark styling
const markDesc = new MarkViewDesc(parent, mark, dom, contentDOM);

// Marks are layered - a bold italic link would have three MarkViewDescs
```

### CustomNodeViewDesc

Used when developers provide custom node views:

```typescript
import { CustomNodeViewDesc } from "@type-editor/viewdesc";

// Created automatically when using custom node views
const customDesc = new CustomNodeViewDesc(
  parent,
  node,
  outerDeco,
  innerDeco,
  dom,
  contentDOM,
  nodeDOM,
  nodeView, // The custom node view object
  view,
  getPos,
);
```

## Working with ViewDescs

### Creating the View Tree

ViewDescs are typically created internally by the editor view:

```typescript
import { docViewDesc } from "@type-editor/viewdesc";

// Creates the root ViewDesc tree
const docView = docViewDesc(
  state.doc, // Document
  outerDeco, // Outer decorations
  innerDeco, // Inner decorations
  containerDOM, // Container element
  editorView, // View instance
);
```

### Updating ViewDescs

The `ViewDescUpdater` handles incremental updates:

```typescript
import { ViewDescUpdater } from "@type-editor/viewdesc";

// Attempts to update the existing tree
const updated = ViewDescUpdater.update(
  viewDesc,
  editorView,
  newNode,
  outerDeco,
  innerDeco,
);

if (!updated) {
  // Full redraw needed
  viewDesc.destroy();
  viewDesc = createNewViewDesc();
}
```

### Position Mapping

Convert between document positions and DOM coordinates:

```typescript
// Document position → DOM coordinates
const { node, offset } = viewDesc.domFromPos(15, 1);
// Returns the DOM node and offset at document position 15

// DOM coordinates → Document position
const pos = viewDesc.posFromDOM(domNode, domOffset, bias);
// Returns the document position for the given DOM location

// Position before a child
const pos = viewDesc.posBeforeChild(childViewDesc);
```

### Utility Functions

The `ViewDescUtil` provides helper functions:

```typescript
import { ViewDescUtil } from "@type-editor/viewdesc";

// Find ViewDesc by DOM node
const desc = ViewDescUtil.findByDOM(domNode);

// Find parent block ViewDesc
const blockDesc = ViewDescUtil.findParentBlock(viewDesc);

// Check if ViewDesc needs update
const needsUpdate = ViewDescUtil.needsUpdate(viewDesc, node, deco);
```

## Advanced Usage

### Custom Node Views

Custom node views automatically get wrapped in `CustomNodeViewDesc`:

```typescript
import { EditorView } from "@type-editor/view";

const view = new EditorView({
  nodeViews: {
    // Custom rendering for images
    image(node, view, getPos) {
      const dom = document.createElement("figure");
      const img = document.createElement("img");
      img.src = node.attrs.src;
      dom.appendChild(img);

      // CustomNodeViewDesc wraps this automatically
      return { dom };
    },

    // Custom rendering with content
    callout(node, view, getPos) {
      const dom = document.createElement("div");
      dom.className = "callout";
      const contentDOM = document.createElement("div");
      contentDOM.className = "callout-content";
      dom.appendChild(contentDOM);

      return { dom, contentDOM };
    },
  },
});
```

### Decoration Rendering

ViewDescs apply decorations during rendering:

```typescript
// Inline decorations add attributes to text
const inlineDeco = Decoration.inline(5, 15, {
  class: "highlight",
  style: "background: yellow",
});
// MarkViewDesc or TextViewDesc applies these attributes

// Node decorations wrap entire nodes
const nodeDeco = Decoration.node(20, 45, {
  class: "selected-node",
});
// NodeViewDesc wraps the node with decoration elements

// Widget decorations insert DOM elements
const widgetDeco = Decoration.widget(10, () => {
  const el = document.createElement("span");
  el.textContent = "📍";
  return el;
});
// WidgetViewDesc manages the widget DOM
```

### Dirty State Tracking

ViewDescs track what needs updating:

```typescript
import { ViewDirtyState } from "@type-editor/viewdesc";

// Dirty states
ViewDirtyState.NOT_DIRTY; // No update needed
ViewDirtyState.CHILD_DIRTY; // Children need update
ViewDirtyState.CONTENT_DIRTY; // Content needs update
ViewDirtyState.NODE_DIRTY; // Entire node needs update

// Mark a range as dirty
viewDesc.markDirty(from, to);

// Check if ViewDesc is dirty
if (viewDesc.dirty !== ViewDirtyState.NOT_DIRTY) {
  // Needs update
}
```

### Position and Offset Calculations

Working with positions in the ViewDesc tree:

```typescript
// Get position before a specific child
const posBefore = parent.posBeforeChild(child);

// Get position after a child
const posAfter = posBefore + child.size;

// Find child at a position
const child = viewDesc.childAfter(pos);

// Local position from DOM
const localPos = viewDesc.localPosFromDOM(domNode, offset, bias);
```

## Performance Considerations

1. **Incremental updates**: ViewDesc enables efficient partial DOM updates instead of full rerenders
2. **Dirty tracking**: Only updates parts marked as dirty
3. **Node matching**: Reuses existing ViewDesc nodes when possible
4. **DOM node reuse**: Keeps DOM nodes stable across updates when content hasn't changed
5. **Position caching**: Maintains position information for fast lookups
6. **Minimal DOM operations**: Batches and minimizes DOM changes

## Internal Architecture

The ViewDesc system consists of several interconnected components:

- **ViewDesc**: Base class with core functionality
- **ViewDescFactory**: Creates appropriate ViewDesc instances
- **ViewDescUpdater**: Handles incremental updates
- **ViewDescUtil**: Utility functions for working with ViewDescs
- **ViewTreeUpdater**: Manages tree-level updates
- **OuterDecoLevel**: Manages decoration wrapper levels

These components work together to provide efficient, incremental DOM rendering while maintaining the connection between the document model and the visual representation.

## API Reference

### ViewDesc

Base class methods and properties:

**Properties:**

- `dom: Node` - The DOM node
- `contentDOM: HTMLElement | null` - Container for child content
- `parent: ViewDesc | undefined` - Parent ViewDesc
- `children: ViewDesc[]` - Child ViewDescs
- `dirty: ViewDirtyState` - Dirty state
- `node: Node | null` - Associated ProseMirror node

**Methods:**

- `destroy(): void` - Clean up resources
- `markDirty(from: number, to: number): void` - Mark range as dirty
- `domFromPos(pos: number, side: number): DOMPosition` - Map position to DOM
- `localPosFromDOM(node: Node, offset: number, bias: number): number` - Map DOM to position
- `posBeforeChild(child: ViewDesc): number` - Get position before child

### NodeViewDesc

Extends ViewDesc with node-specific functionality:

**Additional Properties:**

- `outerDeco: Decoration[] | null` - Outer decorations
- `innerDeco: DecorationSource | null` - Inner decorations
- `nodeDOM: Node` - The node's DOM element
- `size: number` - Node size
- `border: number` - Border size
- `domAtom: boolean` - Whether node is a DOM atom

**Static Methods:**

- `applyOuterDeco(dom: Node, deco: Decoration[], node: Node): Node` - Apply decorations to DOM

### ViewDescUpdater

Static methods for updating ViewDescs:

- `update(viewDesc: ViewDesc, view: EditorView, node: Node, outerDeco, innerDeco): boolean` - Update ViewDesc
- `updateChildren(viewDesc: ViewDesc, view: EditorView, pos: number): void` - Update children

### ViewDescUtil

Utility functions:

- `findByDOM(dom: Node): ViewDesc | undefined` - Find ViewDesc by DOM node
- Various helper functions for ViewDesc manipulation

## Compatibility

This module is a refactored version of ProseMirror's internal view description system. While the core concepts remain the same, the API is restructured and improved with TypeScript types. For full ProseMirror compatibility, use the compatibility layer packages.

## Related Modules

- `@type-editor/view`: The editor view that uses ViewDesc for rendering
- `@type-editor/decoration`: Decoration system that ViewDesc renders
- `@type-editor/model`: Document model that ViewDesc represents
- `@type-editor/dom-util`: DOM utility functions used by ViewDesc
- `@type-editor/transform`: Position mapping used during updates

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

[AbstractViewDesc](AbstractViewDesc/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[CompositionViewDesc](CompositionViewDesc/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[CustomNodeViewDesc](CustomNodeViewDesc/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[doc-view-desc](doc-view-desc/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[MarkViewDesc](MarkViewDesc/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[NodeViewDesc](NodeViewDesc/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[OuterDecoLevel](OuterDecoLevel/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[TextViewDesc](TextViewDesc/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[TrailingHackViewDesc](TrailingHackViewDesc/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[util/replace-nodes](util/replace-nodes/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[util/same-outer-deco](util/same-outer-deco/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[ViewDesc](ViewDesc/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[ViewDescFactory](ViewDescFactory/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[ViewDescType](ViewDescType/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[ViewDescUpdater](ViewDescUpdater/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[ViewDescUtil](ViewDescUtil/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[ViewDirtyState](ViewDirtyState/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[ViewTreeUpdater](ViewTreeUpdater/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[WidgetViewDesc](WidgetViewDesc/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
</tbody>
</table>
