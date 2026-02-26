# @type-editor/selection-util

This module was part of the `ProseMirror view module`.

Selection utility functions for the Type Editor.

This module provides utility functions for handling the synchronization and conversion between DOM selections and ProseMirror selections. It handles browser-specific quirks, Shadow DOM support, and various edge cases that arise when working with rich text selections.

## Installation

```bash
npm install @type-editor/selection-util
```

## API Reference

### Selection Conversion

#### `selectionFromDOM(view: PmEditorView, origin?: string | null): PmSelection | null`

Converts a DOM selection to a ProseMirror Selection.

This function reads the current browser selection and translates it into a ProseMirror selection that can be used with the editor state. It handles various edge cases including collapsed selections, node selections, and multi-range selections.

```typescript
import { selectionFromDOM } from '@type-editor/selection-util';

// Convert the current browser selection to a ProseMirror selection
const selection = selectionFromDOM(view);
if (selection) {
    const tr = view.state.tr.setSelection(selection);
    view.dispatch(tr);
}

// Pass origin for bias calculation (e.g., from pointer events)
const pointerSelection = selectionFromDOM(view, 'pointer');
```

#### `selectionToDOM(view: PmEditorView, force?: boolean): void`

Synchronizes the ProseMirror selection to the DOM.

This function updates the browser's selection to match the current ProseMirror selection state. It handles various edge cases including:
- Node selections
- Delayed drag selections in Chrome
- Broken selection behavior in Safari/older Chrome
- Cursor wrappers for special cases
- Selection visibility

```typescript
import { selectionToDOM } from '@type-editor/selection-util';

// Sync the current ProseMirror selection to the DOM
selectionToDOM(view);

// Force sync even if it appears unnecessary
selectionToDOM(view, true);
```

### Selection Creation

#### `selectionBetween(view: PmEditorView, $anchor: ResolvedPos, $head: ResolvedPos, bias?: number): PmSelection`

Creates a selection between two resolved positions.

This function first checks if any plugins provide a custom `createSelectionBetween` method. If not, it falls back to creating a standard text selection. This allows plugins to implement custom selection types (e.g., table cell selections).

```typescript
import { selectionBetween } from '@type-editor/selection-util';

const doc = view.state.doc;
const $anchor = doc.resolve(10);
const $head = doc.resolve(20);

// Create a selection between two positions
const selection = selectionBetween(view, $anchor, $head);

// With forward bias
const forwardSelection = selectionBetween(view, $anchor, $head, 1);

// With backward bias
const backwardSelection = selectionBetween(view, $anchor, $head, -1);
```

### Selection State Checks

#### `hasFocusAndSelection(view: PmEditorView): boolean`

Checks if the editor both has focus and contains a selection.

For editable views, this requires the view to have focus. For all views, this checks if a valid selection exists within the editor.

```typescript
import { hasFocusAndSelection } from '@type-editor/selection-util';

if (hasFocusAndSelection(view)) {
    // Safe to perform selection-dependent operations
    console.log('Editor has focus and selection');
}
```

#### `selectionCollapsed(domSel: DOMSelectionRange): boolean`

Checks if a DOM selection is collapsed (has no range).

This function works around a Chrome issue where `isCollapsed` inappropriately returns true in Shadow DOM. It uses position comparison to properly detect collapsed selections.

```typescript
import { selectionCollapsed } from '@type-editor/selection-util';

const domSelection = view.domSelectionRange();
if (selectionCollapsed(domSelection)) {
    console.log('Selection is a caret (collapsed)');
} else {
    console.log('Selection has a range');
}
```

#### `anchorInRightPlace(view: PmEditorView): boolean`

Checks if the DOM selection's anchor is at the expected position.

This compares the ProseMirror selection's anchor position with the actual DOM selection's anchor position to verify they are equivalent. This is useful for detecting if the DOM selection has drifted from the expected state.

```typescript
import { anchorInRightPlace } from '@type-editor/selection-util';

if (!anchorInRightPlace(view)) {
    // DOM selection has drifted, may need to resync
    selectionToDOM(view, true);
}
```

### Caret Position

#### `caretFromPoint(doc: Document, x: number, y: number): { node: Node, offset: number } | undefined`

Gets the caret position from a point in the document.

This function tries browser-specific methods to determine the DOM position (node and offset) at the given screen coordinates. It handles both Firefox's `caretPositionFromPoint` and Chrome/Safari's `caretRangeFromPoint`.

The offset is clipped to the node size to handle edge cases where browsers might return invalid offsets (e.g., text offsets into `<input>` nodes).

```typescript
import { caretFromPoint } from '@type-editor/selection-util';

document.addEventListener('click', (event) => {
    const position = caretFromPoint(document, event.clientX, event.clientY);
    if (position) {
        console.log('Clicked at node:', position.node);
        console.log('Offset:', position.offset);
    }
});
```

### Node Selection Sync

#### `syncNodeSelection(view: PmEditorView, sel: PmSelection): void`

Synchronizes node selection state between ProseMirror and the DOM.

When a node is selected (as opposed to text selection), this function ensures that the appropriate view descriptor is marked as selected, and any previously selected node is deselected. This allows node views to apply custom styling or behavior when selected.

```typescript
import { syncNodeSelection } from '@type-editor/selection-util';

// Typically called internally by selectionToDOM, but can be used directly
syncNodeSelection(view, view.state.selection);
```

## Browser Compatibility

This module handles several browser-specific quirks:

- **Chrome**: Handles delayed drag selection sync to prevent flickering
- **Chrome Shadow DOM**: Works around `isCollapsed` returning incorrect values in Shadow DOM
- **Safari/older Chrome**: Works around issues with selections between non-editable block nodes
- **Firefox**: Uses `caretPositionFromPoint` API for caret position detection
- **All browsers**: Falls back to `caretRangeFromPoint` when Firefox API is unavailable

## License

MIT
