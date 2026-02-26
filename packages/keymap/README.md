# @type-editor/keymap

This is a refactored version of the [prosemirror-keymap](https://github.com/ProseMirror/prosemirror-keymap) module.

A plugin for conveniently defining key bindings in a Type Editor.

## Installation

```bash
npm install @type-editor/keymap
```

## Overview

This module provides utilities for defining keyboard shortcuts that trigger editor commands. It exports a `keymap` function that creates a plugin from a set of key bindings, and pre-configured base keymaps with common editing shortcuts.

## API

### keymap

Creates a keymap plugin for the given set of key bindings.

```typescript
import { keymap } from '@type-editor/keymap';
import { toggleBold, insertHardBreak } from './my-commands';

const myKeymap = keymap({
  "Mod-b": toggleBold,
  "Mod-Enter": insertHardBreak,
  "Alt-ArrowUp": joinUp
});
```

Bindings should map key names to command-style functions (see [@type-editor/commands](../commands)), which will be called with `(EditorState, dispatch, EditorView)` arguments and should return `true` when they've handled the key.

### keydownHandler

Creates a keydown handler function from a set of key bindings. This is useful when you want to handle key events directly in editor props rather than through a plugin.

```typescript
import { keydownHandler } from '@type-editor/keymap';

const handler = keydownHandler({
  "Enter": insertParagraph,
  "Mod-b": toggleBold
});

// Use in EditorProps: { handleKeyDown: handler }
```

### Base Keymaps

The module exports pre-configured keymaps with common editing bindings:

| Export          | Description                                                                   |
|-----------------|-------------------------------------------------------------------------------|
| `baseKeymap`    | Platform-aware keymap (uses `macBaseKeymap` on Mac, `pcBaseKeymap` elsewhere) |
| `pcBaseKeymap`  | Standard PC keyboard bindings                                                 |
| `macBaseKeymap` | Mac-specific bindings (extends `pcBaseKeymap` with additional shortcuts)      |

#### Default Bindings

The base keymaps include the following bindings (commands are chained where multiple are listed):

| Key                 | Command(s)                                                             |
|---------------------|------------------------------------------------------------------------|
| **Enter**           | `newlineInCode`, `createParagraphNear`, `liftEmptyBlock`, `splitBlock` |
| **Mod-Enter**       | `exitCode`                                                             |
| **Backspace**       | `deleteSelection`, `joinBackward`, `selectNodeBackward`                |
| **Mod-Backspace**   | `deleteSelection`, `joinBackward`, `selectNodeBackward`                |
| **Shift-Backspace** | `deleteSelection`, `joinBackward`, `selectNodeBackward`                |
| **Delete**          | `deleteSelection`, `joinForward`, `selectNodeForward`                  |
| **Mod-Delete**      | `deleteSelection`, `joinForward`, `selectNodeForward`                  |
| **Mod-a**           | `selectAll`                                                            |

##### Additional Mac-only bindings

| Key                    | Command                |
|------------------------|------------------------|
| **Ctrl-h**             | Same as Backspace      |
| **Alt-Backspace**      | Same as Mod-Backspace  |
| **Ctrl-d**             | Same as Delete         |
| **Ctrl-Alt-Backspace** | Same as Mod-Delete     |
| **Alt-Delete**         | Same as Mod-Delete     |
| **Alt-d**              | Same as Mod-Delete     |
| **Ctrl-a**             | `selectTextblockStart` |
| **Ctrl-e**             | `selectTextblockEnd`   |

## Key Name Format

Key names may be strings like `"Shift-Ctrl-Enter"` — a key identifier prefixed with zero or more modifiers.

### Key Identifiers

Key identifiers are based on the strings that can appear in [`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key). Use lowercase letters to refer to letter keys (or uppercase letters if you want shift to be held). You may use `"Space"` as an alias for the `" "` name.

### Modifiers

Modifiers can be given in any order:

| Modifier | Aliases                                          |
|----------|--------------------------------------------------|
| `Shift-` | `s-`                                             |
| `Alt-`   | `a-`                                             |
| `Ctrl-`  | `c-`, `Control-`                                 |
| `Cmd-`   | `m-`, `Meta-`                                    |
| `Mod-`   | Platform-aware: `Cmd-` on Mac, `Ctrl-` elsewhere |

For characters that are created by holding shift, the `Shift-` prefix is implied and should not be added explicitly.

## Multiple Keymaps

You can add multiple keymap plugins to an editor. The order in which they appear determines their precedence — plugins earlier in the array get to dispatch first.

```typescript
import { keymap, baseKeymap } from '@type-editor/keymap';

const plugins = [
  keymap(customBindings),  // Custom bindings take precedence
  keymap(baseKeymap)       // Fallback to base keymap
];
```

## Related Packages

- [@type-editor/commands](../commands) - Command functions to use with keymaps
- [@type-editor/state](../state) - Editor state and plugin system
- [@type-editor/view](../view) - Editor view that processes key events

## License

MIT
