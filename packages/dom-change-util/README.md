# @type-editor/dom-change-util

This module was part of the `ProseMirror view module`.

DOM mutation detection and processing utilities for Type Editor. This module handles reading changes from the DOM and converting them into editor transactions.

## Installation

```bash
npm install @type-editor/dom-change-util
```

## Overview

This module provides the core functionality for detecting and processing DOM mutations in a content-editable editor. It bridges the gap between browser DOM changes and the Type Editor's document model, handling various browser-specific quirks and edge cases.

### Key Responsibilities

- **Parse DOM changes** and convert them to document changes
- **Handle browser-specific quirks** (Chrome, Safari, IE11, Android, iOS)
- **Detect and optimize mark changes** (bold, italic, etc.)
- **Manage selection reconstruction** after DOM mutations
- **Handle composition events** and IME input

## API

### `readDOMChange`

The main entry point for processing DOM mutations. Reads changes from the DOM and converts them into editor transactions.

```typescript
import { readDOMChange } from '@type-editor/dom-change-util';

readDOMChange(view, from, to, typeOver, addedNodes);
```

#### Parameters

| Parameter    | Type                  | Description                                                                   |
|--------------|-----------------------|-------------------------------------------------------------------------------|
| `view`       | `EditorView`          | The editor view containing the DOM and document state                         |
| `from`       | `number`              | Start position of the change. Negative values indicate selection-only changes |
| `to`         | `number`              | End position of the change                                                    |
| `typeOver`   | `boolean`             | Whether this change is part of typing over an active selection                |
| `addedNodes` | `ReadonlyArray<Node>` | DOM nodes added during the mutation                                           |

### Processing Pipeline

1. **Selection-only changes**: When `from < 0`, handles pure selection updates without content changes
2. **Range adjustment**: Expands the change range to block boundaries for accurate parsing
3. **DOM parsing**: Parses the changed DOM range into a document representation
4. **Diff detection**: Compares parsed content with the current document to find differences
5. **Browser adjustments**: Applies browser-specific fixes and workarounds
6. **Transaction dispatch**: Creates and dispatches appropriate transactions

## Browser Compatibility

The module includes specific handling for:

| Browser        | Special Handling                                          |
|----------------|-----------------------------------------------------------|
| **Chrome**     | Backspace behavior, composition deletion quirks           |
| **Safari/iOS** | Enter key detection, selection timing                     |
| **IE11**       | Non-breaking space insertion, selection positioning       |
| **Android**    | Enter-and-pick-suggestion action, virtual keyboard quirks |
| **Edge**       | Cursor advancement in empty blocks                        |

## Types

### `DocumentChange`

Represents a detected change in the document.

```typescript
interface DocumentChange {
  /** Start position of the change */
  start: number;
  /** End position in the old document */
  endA: number;
  /** End position in the new document */
  endB: number;
}
```

### `ParseBetweenResult`

Result of parsing a DOM range into a document.

```typescript
interface ParseBetweenResult {
  /** Parsed document node */
  doc: Node;
  /** Reconstructed selection (anchor/head positions) */
  sel: { anchor: number; head: number } | null;
  /** Start position where parsing began */
  from: number;
  /** End position where parsing ended */
  to: number;
}
```

## Internal Structure

```
src/
├── index.ts                    # Package exports
└── dom-change/
    ├── read-dom-change.ts      # Main entry point
    ├── constants.ts            # Shared constants
    ├── browser-hacks/          # Browser-specific workarounds
    │   ├── is-android-enter-suggestion-quirk.ts
    │   ├── is-ie11-non-breaking-space-bug.ts
    │   ├── should-handle-mobile-enter-key.ts
    │   └── ...
    ├── parse-change/           # Change detection and parsing
    │   ├── find-diff.ts
    │   ├── parse-between.ts
    │   ├── is-mark-change.ts
    │   ├── looks-like-enter-key.ts
    │   ├── looks-like-backspace-key.ts
    │   └── ...
    ├── types/                  # Type definitions
    │   └── dom-change/
    │       ├── DocumentChange.ts
    │       ├── ParseBetweenResult.ts
    │       └── ...
    └── util/                   # Helper utilities
```

## Notes

All referencing and parsing is done with the start-of-operation selection and document, since that's what the DOM represents. If any changes came in the meantime, the modification is mapped over those before it is applied.

## License

MIT
