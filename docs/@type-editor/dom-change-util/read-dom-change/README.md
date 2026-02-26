[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/dom-change-util](../README.md) / read-dom-change

# read-dom-change

## Remarks

All referencing and parsing is done with the start-of-operation selection
and document, since that's the one that the DOM represents. If any changes came
in the meantime, the modification is mapped over those before it is applied.

## Functions

<table>
<thead>
<tr>
<th>Function</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[readDOMChange](functions/readDOMChange.md)

</td>
<td>

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

**See**

- [parseBetween](../parse-change/parse-between/functions/parseBetween.md) for DOM parsing
- [findDiff](../parse-change/find-diff/functions/findDiff.md) for change detection
- [handleSelectionOnlyChange](../parse-change/handle-selection-only-change/functions/handleSelectionOnlyChange.md) for selection updates

**Example**

```typescript
// Called by the DOM observer when mutations are detected
view.domObserver.flush(); // This internally calls readDOMChange
```

</td>
</tr>
</tbody>
</table>
