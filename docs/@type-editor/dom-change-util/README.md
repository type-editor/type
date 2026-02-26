[**Type Editor**](../../README.md)

---

[Type Editor](../../index.md) / @type-editor/dom-change-util

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
import { readDOMChange } from "@type-editor/dom-change-util";

readDOMChange(view, from, to, typeOver, addedNodes);
```

#### Parameters

| Parameter    | Type                  | Description                                                                   |
| ------------ | --------------------- | ----------------------------------------------------------------------------- |
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
| -------------- | --------------------------------------------------------- |
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

[browser-hacks/adjust-for-chrome-backspace-bug](browser-hacks/adjust-for-chrome-backspace-bug/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[browser-hacks/handle-br-node-rule](browser-hacks/handle-br-node-rule/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[browser-hacks/is-android-enter-suggestion-quirk](browser-hacks/is-android-enter-suggestion-quirk/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[browser-hacks/is-ie11-non-breaking-space-bug](browser-hacks/is-ie11-non-breaking-space-bug/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[browser-hacks/looks-likes-enter-key-ios](browser-hacks/looks-likes-enter-key-ios/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[browser-hacks/should-handle-android-enter-key](browser-hacks/should-handle-android-enter-key/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[browser-hacks/should-handle-mobile-enter-key](browser-hacks/should-handle-mobile-enter-key/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[browser-hacks/should-suppress-selection-during-composition](browser-hacks/should-suppress-selection-during-composition/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[constants](constants/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[parse-change/find-diff](parse-change/find-diff/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[parse-change/get-preferred-diff-position](parse-change/get-preferred-diff-position/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[parse-change/handle-selection-only-change](parse-change/handle-selection-only-change/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[parse-change/is-mark-change](parse-change/is-mark-change/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[parse-change/looks-like-backspace](parse-change/looks-like-backspace/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[parse-change/looks-like-backspace-key](parse-change/looks-like-backspace-key/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[parse-change/looks-like-enter-key](parse-change/looks-like-enter-key/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[parse-change/needs-selection-overwrite-adjustment](parse-change/needs-selection-overwrite-adjustment/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[parse-change/parse-between](parse-change/parse-between/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[parse-change/resolve-selection](parse-change/resolve-selection/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[parse-change/should-adjust-change-end-to-selection](parse-change/should-adjust-change-end-to-selection/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[parse-change/should-adjust-change-start-to-selection](parse-change/should-adjust-change-start-to-selection/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[parse-change/should-create-type-over-change](parse-change/should-create-type-over-change/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[read-dom-change](read-dom-change/README.md)

</td>
<td>

**Remarks**

All referencing and parsing is done with the start-of-operation selection
and document, since that's the one that the DOM represents. If any changes came
in the meantime, the modification is mapped over those before it is applied.

</td>
</tr>
<tr>
<td>

[types/dom-change/DocumentChange](types/dom-change/DocumentChange/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/dom-change/DOMPositionInfo](types/dom-change/DOMPositionInfo/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/dom-change/MarkChangeInfo](types/dom-change/MarkChangeInfo/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/dom-change/ParseBetweenResult](types/dom-change/ParseBetweenResult/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[util/key-event](util/key-event/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
</tbody>
</table>
