# @type-editor/dom-coords-util

This module was part of the `ProseMirror view module`.

DOM coordinates utility functions for Type Editor projects.

This module provides utilities for working with DOM coordinates in a rich text editor context. It handles the complex task of mapping between document positions and screen coordinates, managing scroll positions, and detecting text block boundaries.

## Installation

```bash
npm install @type-editor/dom-coords-util
```

## API Reference

### Position & Coordinate Mapping

#### `coordsAtPos(view, pos, side)`

Given a position in the document model, get a bounding box of the character at that position, relative to the window.

```typescript
import { coordsAtPos } from '@type-editor/dom-coords-util';

const rect = coordsAtPos(view, pos, 1);
// Returns: { top, bottom, left, right }
```

**Parameters:**
- `view` - The editor view
- `pos` - The document position to get coordinates for
- `side` - Direction bias: negative for before, positive for after

**Returns:** A `Rect` representing the character's bounding box

#### `posAtCoords(view, coords)`

Given x,y coordinates on the editor, get the corresponding position in the document. This function handles various browser quirks and edge cases to accurately determine the document position from screen coordinates.

```typescript
import { posAtCoords } from '@type-editor/dom-coords-util';

const result = posAtCoords(view, { left: 100, top: 200 });
// Returns: { pos: number, inside: number } | null
```

**Parameters:**
- `view` - The editor view
- `coords` - The screen coordinates to convert (`{ left, top }`)

**Returns:** Object containing the document position and inside information, or `null` if outside editor

### Text Block Detection

#### `endOfTextblock(view, state, dir)`

Determine whether the cursor is at the edge of a text block in the given direction. This function is cached for performance - repeated calls with the same state and direction will return the cached result.

```typescript
import { endOfTextblock } from '@type-editor/dom-coords-util';

const isAtEnd = endOfTextblock(view, state, 'down');
// Returns: boolean
```

**Parameters:**
- `view` - The editor view
- `state` - The editor state containing the current selection
- `dir` - The direction to check: `'up'`, `'down'`, `'left'`, `'right'`, `'forward'`, or `'backward'`

**Returns:** `true` if the cursor is at the edge of a text block in the given direction

### Scroll Management

#### `scrollRectIntoView(view, rect, startDOM)`

Scroll the given rectangle into view within the editor, walking up through scrollable ancestors and adjusting scroll positions as needed.

```typescript
import { scrollRectIntoView } from '@type-editor/dom-coords-util';

scrollRectIntoView(view, rect, startDOM);
```

**Parameters:**
- `view` - The editor view
- `rect` - The rectangle to scroll into view
- `startDOM` - The starting DOM node (defaults to `view.dom`)

#### `storeScrollPos(view)`

Store the scroll position of the editor's parent nodes, along with the top position of an element near the top of the editor. This is used to maintain viewport stability when content above changes.

```typescript
import { storeScrollPos } from '@type-editor/dom-coords-util';

const scrollPos = storeScrollPos(view);
// Returns: StoredScrollPos
```

**Returns:** A `StoredScrollPos` object containing reference element info and scroll stack

#### `resetScrollPos(storedPos)`

Reset the scroll position of the editor's parent nodes to what it was before, when `storeScrollPos` was called. This maintains viewport stability when content above the viewport changes.

```typescript
import { storeScrollPos, resetScrollPos } from '@type-editor/dom-coords-util';

const scrollPos = storeScrollPos(view);
// ... perform operations that might change scroll ...
resetScrollPos(scrollPos);
```

**Parameters:**
- `storedPos` - Object containing scroll position data from `storeScrollPos`

#### `focusPreventScroll(dom)`

Focus an element without scrolling. Feature-detects support for `.focus({preventScroll: true})`, and uses a fallback when not supported.

```typescript
import { focusPreventScroll } from '@type-editor/dom-coords-util';

focusPreventScroll(element);
```

**Parameters:**
- `dom` - The HTML element to focus without scrolling

## Types

### `StoredScrollPos`

Interface for storing scroll position data:

```typescript
interface StoredScrollPos {
    refDOM: HTMLElement;
    refTop: number;
    stack: Array<ScrollPos>;
}
```

## License

MIT

