[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-change-util](../../README.md) / [read-dom-change](../README.md) / readDOMChange

# Function: readDOMChange()

```ts
function readDOMChange(view, from, to, typeOver, addedNodes): void;
```

Defined in: [read-dom-change.ts:101](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/dom-change-util/src/dom-change/read-dom-change.ts#L101)

Reads and processes changes from the DOM, converting them into ProseMirror transactions.

This is the main entry point for handling DOM mutations and converting them into
document updates. It orchestrates the entire DOM change detection and processing
pipeline, including:

**Core Process:**

1. Handles selection-only changes (when from \< 0)
2. Adjusts change range to block boundaries
3. Parses the changed DOM range into a ProseMirror document
4. Compares parsed content with current document to find differences
5. Applies various browser-specific adjustments
6. Creates and dispatches appropriate transactions

**Special Handling:**

- Mobile Enter key detection (iOS/Android)
- Type-over selection behavior
- Mark-only changes (bold, italic, etc.)
- Backspace/Enter key event delegation
- Browser-specific quirks (Chrome, Safari, IE11, Android)
- IME composition tracking

**Transaction Types:**

- Selection updates (for selection-only changes)
- Content replacements (for insertions/deletions)
- Mark additions/removals (optimized path for styling changes)
- Text insertions (with handleTextInput plugin support)

The function ensures that all changes maintain document validity and properly
handle edge cases across different browsers and input methods.

## Parameters

| Parameter    | Type              | Description                                                                                                                                                                            |
| ------------ | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `view`       | `PmEditorView`    | The editor view containing the DOM, document state, and plugin system. All changes are relative to view.state.doc at the time of the call.                                             |
| `from`       | `number`          | Start position of the change in the document. Negative values (typically -1) indicate selection-only changes with no content modification.                                             |
| `to`         | `number`          | End position of the change in the document. Forms the range [from, to] that was potentially modified in the DOM.                                                                       |
| `typeOver`   | `boolean`         | Whether this change is part of typing over an active selection. When true, special handling ensures the entire selection is replaced even if the diff only detects part of the change. |
| `addedNodes` | readonly `Node`[] | Readonly array of DOM nodes that were added during the mutation. Used for detecting block-level Enter key presses on mobile devices.                                                   |

## Returns

`void`

## See

- [parseBetween](../../parse-change/parse-between/functions/parseBetween.md) for DOM parsing
- [findDiff](../../parse-change/find-diff/functions/findDiff.md) for change detection
- [handleSelectionOnlyChange](../../parse-change/handle-selection-only-change/functions/handleSelectionOnlyChange.md) for selection updates

## Example

```typescript
// Called by the DOM observer when mutations are detected
view.domObserver.flush(); // This internally calls readDOMChange
```
