# @type-editor/view

This is a refactored version of the [prosemirror-view](https://github.com/ProseMirror/prosemirror-view) module.

This module exports the
`EditorView` class, which renders the current document in the browser
as a DOM representation and handles user events.

## Installation

```bash
npm install @type-editor/view
```

## Styling

Make sure you load `style/prosemirror.css` as a stylesheet when using
this module. The CSS provides essential styles for the editor's
appearance and behavior.

```html
<link rel="stylesheet" href="node_modules/@type-editor/view/style/prosemirror.css">
```

## EditorView

The `EditorView` class manages the DOM structure that represents an
editable document. Its state and behavior are determined by its props.

The view is responsible for:
- Rendering the document state as DOM elements
- Handling user input and converting it to transactions
- Managing selections and keeping them in sync with the DOM
- Coordinating plugin views and custom node views
- Observing external DOM changes (composition, spellcheck, etc.)

### Creating an Editor View

```typescript
import { EditorView } from '@type-editor/view';
import { EditorState } from '@type-editor/state';
import { schema } from '@type-editor/schema';

// Create initial editor state
const state = EditorState.create({ schema });

// Mount the editor by appending to a DOM element
const view = new EditorView(document.querySelector('#editor'), {
  state,
  dispatchTransaction(transaction) {
    const newState = view.state.apply(transaction);
    view.updateState(newState);
  }
});

// Alternative: use a custom mounting function
const view = new EditorView((editorElement) => {
  document.body.appendChild(editorElement);
}, { state });

// Alternative: reuse an existing element
const view = new EditorView({ mount: document.querySelector('#editor') }, { state });
```

### Accessing State and DOM

```typescript
// Access the current editor state
view.state;

// Access the editor's DOM element
view.dom;

// Check if the editor has focus
view.hasFocus();

// Check if the editor is editable
view.editable;

// Check if a composition is active (IME input)
view.composing;
```

### Updating the Editor

```typescript
// Update editor state after applying a transaction
const tr = view.state.tr.insertText('Hello');
const newState = view.state.apply(tr);
view.updateState(newState);

// Update props
view.setProps({ editable: () => false });

// Full props update
view.update({ state: newState, plugins: [myPlugin] });
```

### Dispatching Transactions

```typescript
// Dispatch a transaction (uses dispatchTransaction prop if defined)
view.dispatch(view.state.tr.insertText('Hello'));

// Delete selection
view.dispatch(view.state.tr.deleteSelection());
```

### Position and Coordinate Utilities

```typescript
// Get document position from viewport coordinates (e.g., mouse click)
const pos = view.posAtCoords({ left: event.clientX, top: event.clientY });
if (pos) {
  console.log('Document position:', pos.pos);
  console.log('Inside node at:', pos.inside);
}

// Get viewport coordinates from document position
const coords = view.coordsAtPos(view.state.selection.head);
console.log('Cursor at:', coords.left, coords.top);

// Get DOM node at a position
const domNode = view.nodeDOM(pos);

// Get document position from DOM node
const docPos = view.posAtDOM(domNode, offset);

// Check if at end of textblock in a direction
view.endOfTextblock('left');  // true if at left edge of textblock
```

### Focus and Scrolling

```typescript
// Focus the editor
view.focus();

// Scroll the current selection into view
view.scrollToSelection();
```

### Clipboard Operations

```typescript
// Paste HTML content
view.pasteHTML('<p>Hello <strong>world</strong></p>');

// Paste plain text
view.pasteText('Hello world');

// Serialize content for clipboard
const { dom, text, slice } = view.serializeForClipboard(slice);
```

### Cleanup

```typescript
// Destroy the editor when done
view.destroy();

// Check if destroyed
view.isDestroyed;
```

## Props

@EditorProps

Editor props control the behavior and appearance of the editor. They can be
provided when creating the view or updated later via `update()` or `setProps()`.

### DirectEditorProps

The full set of props that can be passed to `EditorView`, including:

- `state` - The current editor state (required)
- `plugins` - Array of view-level plugins
- `dispatchTransaction` - Custom transaction handler
- `editable` - Function to determine if editor is editable
- `handleDOMEvents` - Custom DOM event handlers
- `handleKeyDown` - Keyboard event handler
- `handleKeyPress` - Key press handler
- `handleTextInput` - Text input handler
- `handleClickOn` - Click handler for specific positions
- `handleClick` - General click handler
- `handleDoubleClickOn` - Double-click handler for specific positions
- `handleDoubleClick` - General double-click handler
- `handleTripleClickOn` - Triple-click handler for specific positions
- `handleTripleClick` - General triple-click handler
- `handlePaste` - Paste event handler
- `handleDrop` - Drop event handler
- `handleScrollToSelection` - Custom scroll behavior
- `decorations` - Function returning decorations to display
- `nodeViews` - Custom node view constructors
- `markViews` - Custom mark view constructors

### someProp

Use `someProp` to query prop values from the view and its plugins:

```typescript
// Check if any handler processes a key event
const handled = view.someProp('handleKeyDown', (handler) => {
  return handler(view, event);
});

// Get the first defined decorations prop
const decos = view.someProp('decorations');
```

## Custom Node Views

@NodeViewConstructor

@NodeView

Node views allow you to customize how specific node types are rendered:

```typescript
const view = new EditorView(element, {
  state,
  nodeViews: {
    image(node, view, getPos) {
      const dom = document.createElement('img');
      dom.src = node.attrs.src;
      dom.alt = node.attrs.alt;
      return { dom };
    }
  }
});
```

## Custom Mark Views

@MarkViewConstructor

@MarkView

Mark views customize how marks are rendered around inline content.

## Decorations

Decorations make it possible to influence the way the document is
drawn without actually changing the document. They are re-exported from
`@type-editor/decoration` for convenience.

@Decoration

@DecorationAttrs

@DecorationSet

@DecorationSource

### Decoration Types

- **Inline decorations** - Add attributes or wrap text ranges
- **Widget decorations** - Insert arbitrary DOM at a position  
- **Node decorations** - Add attributes to a node's DOM representation

```typescript
import { Decoration, DecorationSet } from '@type-editor/view';

// Create decorations in a plugin
const plugin = new Plugin({
  props: {
    decorations(state) {
      const decos = [];
      
      // Highlight a range
      decos.push(Decoration.inline(5, 10, { class: 'highlight' }));
      
      // Add a widget
      const widget = document.createElement('span');
      widget.textContent = '📝';
      decos.push(Decoration.widget(0, widget));
      
      // Add attributes to a node
      decos.push(Decoration.node(0, state.doc.content.size, { class: 'document' }));
      
      return DecorationSet.create(state.doc, decos);
    }
  }
});
```

## DOMObserver

@DOMObserver

The `DOMObserver` observes DOM changes and selection changes in the editor.
It bridges between native browser events and the editor's state management,
ensuring that external DOM modifications (from composition, spellcheck, etc.)
are properly synchronized with the editor state.

## Related Types

@ViewMutationRecord

@DOMEventMap

## License

MIT

