# @type-editor/input

This is a refactored version of the input handling logic from [prosemirror-view](https://github.com/ProseMirror/prosemirror-view).

This module provides input handling functionality for
the Type Editor. It handles all user interactions including keyboard input,
mouse events, clipboard operations, drag-and-drop, touch events, and composition
(IME) input.

## Input State

The `InputState` class tracks the current input state of the editor, including
keyboard modifier keys, mouse state, composition events, and selection state.
It registers and manages all event handlers for the editor.

## Clipboard Operations

Functions for serializing and parsing content to and from the clipboard. This
enables copy, cut, and paste operations while preserving document structure.

### serializeForClipboard

Serializes a slice of document content for placing on the clipboard. Produces
a DOM fragment, plain-text representation, and the (possibly normalized) slice.

```typescript
import { serializeForClipboard } from '@type-editor/input';

const { dom, text, slice } = serializeForClipboard(view, slice);
```

### doPaste

Processes pasted content by parsing it and inserting it into the editor.
Delegates to the `handlePaste` prop if available, otherwise inserts the content
directly.

```typescript
import { doPaste } from '@type-editor/input';

doPaste(view, text, html, preferPlain, event);
```

## Drag and Drop

The `Dragging` class represents an active drag operation, storing information
about what content is being dragged and whether it's a move or copy operation.

```typescript
import { Dragging } from '@type-editor/input';

const dragging = new Dragging(slice, isMove, nodeSelection);
```

## Composition Handling

Utilities for managing IME (Input Method Editor) composition state, which is
crucial for proper handling of complex scripts like CJK (Chinese, Japanese,
Korean) input.

### clearComposition

Clears the current composition state and marks affected DOM nodes as dirty
so they will be re-rendered correctly.

```typescript
import { clearComposition } from '@type-editor/input';

clearComposition(view);
```

## Event Handlers

The module includes handlers for various DOM events:

- **Keyboard**: `keydown`, `keypress`, `keyup`, `compositionstart`, `compositionupdate`, `compositionend`
- **Mouse**: `mousedown`, `contextmenu`
- **Touch**: `touchstart`, `touchmove`
- **Clipboard**: `copy`, `cut`, `paste`
- **Drag/Drop**: `dragstart`, `dragend`, `dragover`, `dragenter`, `drop`
- **Focus**: `focus`, `blur`
- **Input**: `beforeinput`

## License

This project is licensed under the MIT License.
