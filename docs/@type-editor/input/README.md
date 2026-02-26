[**Type Editor**](../../README.md)

---

[Type Editor](../../index.md) / @type-editor/input

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
import { serializeForClipboard } from "@type-editor/input";

const { dom, text, slice } = serializeForClipboard(view, slice);
```

### doPaste

Processes pasted content by parsing it and inserting it into the editor.
Delegates to the `handlePaste` prop if available, otherwise inserts the content
directly.

```typescript
import { doPaste } from "@type-editor/input";

doPaste(view, text, html, preferPlain, event);
```

## Drag and Drop

The `Dragging` class represents an active drag operation, storing information
about what content is being dragged and whether it's a move or copy operation.

```typescript
import { Dragging } from "@type-editor/input";

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
import { clearComposition } from "@type-editor/input";

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

[clipboard/parse-from-clipboard](clipboard/parse-from-clipboard/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[clipboard/parse/add-context](clipboard/parse/add-context/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[clipboard/parse/close-slice](clipboard/parse/close-slice/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[clipboard/parse/create-code-block-slice](clipboard/parse/create-code-block-slice/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[clipboard/parse/create-dom-from-plain-text](clipboard/parse/create-dom-from-plain-text/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[clipboard/parse/normalize-siblings](clipboard/parse/normalize-siblings/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[clipboard/parse/read-html](clipboard/parse/read-html/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[clipboard/parse/restore-replaced-spaces](clipboard/parse/restore-replaced-spaces/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[clipboard/parse/unwrap-serialized-dom](clipboard/parse/unwrap-serialized-dom/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[clipboard/serialize-for-clipboard](clipboard/serialize-for-clipboard/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[clipboard/serialize/apply-required-wrappers](clipboard/serialize/apply-required-wrappers/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[clipboard/util](clipboard/util/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/before-input/before-input-handler](input-handler/before-input/before-input-handler/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/compositon-constants](input-handler/compositon-constants/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/context-menu/context-menu-handler](input-handler/context-menu/context-menu-handler/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/copy-paste/copy-handler](input-handler/copy-paste/copy-handler/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/copy-paste/paste-handler](input-handler/copy-paste/paste-handler/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/copy-paste/util/capture-paste](input-handler/copy-paste/util/capture-paste/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/copy-paste/util/do-paste](input-handler/copy-paste/util/do-paste/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/drag-drop/drag-end-handler](input-handler/drag-drop/drag-end-handler/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/drag-drop/drag-over-enter-handler](input-handler/drag-drop/drag-over-enter-handler/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/drag-drop/drag-start-handler](input-handler/drag-drop/drag-start-handler/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/drag-drop/Dragging](input-handler/drag-drop/Dragging/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/drag-drop/drop-handler](input-handler/drag-drop/drop-handler/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/drag-drop/util/drag-moves](input-handler/drag-drop/util/drag-moves/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/focus/blur-handler](input-handler/focus/blur-handler/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/focus/focus-handler](input-handler/focus/focus-handler/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/key-codes](input-handler/key-codes/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/keyboard/browser-hacks/safari-down-arrow-bug](input-handler/keyboard/browser-hacks/safari-down-arrow-bug/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/keyboard/composition-end-handler](input-handler/keyboard/composition-end-handler/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/keyboard/composition-start-update-handler](input-handler/keyboard/composition-start-update-handler/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/keyboard/key-down-handler](input-handler/keyboard/key-down-handler/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/keyboard/key-press-handler](input-handler/keyboard/key-press-handler/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/keyboard/key-up-handler](input-handler/keyboard/key-up-handler/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/keyboard/keys/is-backspace-key](input-handler/keyboard/keys/is-backspace-key/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/keyboard/keys/is-delete-key](input-handler/keyboard/keys/is-delete-key/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/keyboard/keys/is-down-arrow-key](input-handler/keyboard/keys/is-down-arrow-key/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/keyboard/keys/is-formatting-shortcut](input-handler/keyboard/keys/is-formatting-shortcut/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/keyboard/keys/is-left-arrow-key](input-handler/keyboard/keys/is-left-arrow-key/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/keyboard/keys/is-right-arrow-key](input-handler/keyboard/keys/is-right-arrow-key/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/keyboard/keys/is-up-arrow-key](input-handler/keyboard/keys/is-up-arrow-key/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/keyboard/util/find-direction](input-handler/keyboard/util/find-direction/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/keyboard/util/in-or-near-composition](input-handler/keyboard/util/in-or-near-composition/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/keyboard/util/schedule-compose-end](input-handler/keyboard/util/schedule-compose-end/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/mouse/mouse-down-handler](input-handler/mouse/mouse-down-handler/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/mouse/MouseDown](input-handler/mouse/MouseDown/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/touch/touch-move-handler](input-handler/touch/touch-move-handler/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/touch/touch-start-handler](input-handler/touch/touch-start-handler/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/util/broken-clipboard-api](input-handler/util/broken-clipboard-api/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/util/clear-composition](input-handler/util/clear-composition/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/util/end-composition](input-handler/util/end-composition/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/util/force-dom-flush](input-handler/util/force-dom-flush/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/util/get-text](input-handler/util/get-text/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/util/key-event](input-handler/util/key-event/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[input-handler/util/set-selection-origin](input-handler/util/set-selection-origin/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[InputState](InputState/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/clipboard/SerializationContext](types/clipboard/SerializationContext/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/clipboard/SerializedClipboard](types/clipboard/SerializedClipboard/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/clipboard/TrustedTypesPolicy](types/clipboard/TrustedTypesPolicy/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/input/EventHandler](types/input/EventHandler/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
</tbody>
</table>
