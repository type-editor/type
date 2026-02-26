# @type-editor-compat - Compatibility Layer

This folder contains compatibility layer modules that provide ProseMirror-compatible type signatures for the `@type-editor/*` packages.

## Purpose

The `@type-editor/*` packages use interface types (e.g., `PmEditorState`, `PmPlugin`, `PmTransaction`, `PmEditorView`) for better decoupling between modules. However, this creates compatibility issues with projects like TipTap that expect concrete ProseMirror class types.

The `@type-editor-compat/*` packages solve this by:
1. Re-exporting the base classes from `@type-editor/*`
2. Providing override type definitions that use concrete class references instead of interface types
3. Maintaining zero runtime overhead (no wrapper classes)

## Key Type Overrides

The following interface types are replaced with concrete class types:

| Interface Type | Concrete Type |
|---------------|---------------|
| `PmEditorState` | `EditorState` |
| `PmEditorView` | `EditorView` |
| `PmTransaction` | `Transaction` |
| `PmPlugin` | `Plugin` |
| `PmSelection` | `Selection` |
| `PmStep` | `Step` |
| `PmMapping` | `Mapping` |
| `PmStepMap` | `StepMap` |
| `PmDecoration` | `Decoration` |
| `PmNodeViewDesc` | `NodeViewDesc` |

## Key Modules

### @type-editor-compat/state

The most important module, providing:
- `EditorState` with self-referential concrete return types
- `EditorProps` interface with `EditorView`, `Transaction` instead of `Pm*` interfaces
- `PluginSpec` interface with concrete types
- `StateField` interface with concrete types
- `Command` type with concrete signatures
- All selection classes

### @type-editor-compat/view

Provides:
- `EditorView` with concrete `EditorState` and `Transaction` types
- `DirectEditorProps` interface with concrete types
- `Decoration`, `DecorationSet`

### Other Modules

All other compat modules re-export from their base packages and provide:
- Local type aliases for `EditorState`, `Transaction`, `Plugin`, etc.
- Forward declarations for `EditorView` where needed
- `Command` type with concrete signatures

## Usage

Instead of importing from `@type-editor/*`:

```typescript
// Before (with interface types in signatures)
import { EditorState, Plugin } from '@type-editor/state';
```

Import from `@type-editor-compat/*`:

```typescript
// After (with concrete types in signatures)
import { EditorState, Plugin } from '@type-editor-compat/state';
```

## TipTap Integration

To use with TipTap, configure npm aliases in your project:

```bash
npm install prosemirror-state@npm:@type-editor-compat/state
npm install prosemirror-view@npm:@type-editor-compat/view
npm install prosemirror-model@npm:@type-editor-compat/model
npm install prosemirror-transform@npm:@type-editor-compat/transform
npm install prosemirror-commands@npm:@type-editor-compat/commands
npm install prosemirror-keymap@npm:@type-editor-compat/keymap
npm install prosemirror-history@npm:@type-editor-compat/history
npm install prosemirror-inputrules@npm:@type-editor-compat/inputrules
npm install prosemirror-gapcursor@npm:@type-editor-compat/gapcursor
npm install prosemirror-dropcursor@npm:@type-editor-compat/dropcursor
npm install prosemirror-menu@npm:@type-editor-compat/menu
npm install prosemirror-tables@npm:@type-editor-compat/tables
npm install prosemirror-collab@npm:@type-editor-compat/collab
npm install prosemirror-markdown@npm:@type-editor-compat/markdown
npm install prosemirror-schema-basic@npm:@type-editor-compat/schema
npm install prosemirror-schema-list@npm:@type-editor-compat/schema
```

Or use pnpm overrides in `package.json`:

```json
{
  "pnpm": {
    "overrides": {
      "prosemirror-state": "npm:@type-editor-compat/state",
      "prosemirror-view": "npm:@type-editor-compat/view",
      "prosemirror-model": "npm:@type-editor-compat/model",
      "prosemirror-transform": "npm:@type-editor-compat/transform",
      "prosemirror-commands": "npm:@type-editor-compat/commands",
      "prosemirror-keymap": "npm:@type-editor-compat/keymap",
      "prosemirror-history": "npm:@type-editor-compat/history",
      "prosemirror-inputrules": "npm:@type-editor-compat/inputrules",
      "prosemirror-gapcursor": "npm:@type-editor-compat/gapcursor",
      "prosemirror-dropcursor": "npm:@type-editor-compat/dropcursor",
      "prosemirror-menu": "npm:@type-editor-compat/menu",
      "prosemirror-tables": "npm:@type-editor-compat/tables",
      "prosemirror-collab": "npm:@type-editor-compat/collab",
      "prosemirror-markdown": "npm:@type-editor-compat/markdown",
      "prosemirror-schema-basic": "npm:@type-editor-compat/schema",
      "prosemirror-schema-list": "npm:@type-editor-compat/schema"
    }
  }
}
```

## Package List

| Package | Description |
|---------|-------------|
| `@type-editor-compat/state` | Core state management with EditorState, Plugin, Transaction, Selection |
| `@type-editor-compat/view` | EditorView and view-related types |
| `@type-editor-compat/model` | Document model (Node, Fragment, Mark, Schema) |
| `@type-editor-compat/transform` | Document transformations (Step, Mapping, Transform) |
| `@type-editor-compat/commands` | Editor commands |
| `@type-editor-compat/keymap` | Keyboard bindings |
| `@type-editor-compat/history` | Undo/redo functionality |
| `@type-editor-compat/inputrules` | Input rules for auto-formatting |
| `@type-editor-compat/gapcursor` | Gap cursor for navigating around block nodes |
| `@type-editor-compat/dropcursor` | Drop cursor for drag-and-drop |
| `@type-editor-compat/menu` | Menu components |
| `@type-editor-compat/tables` | Table editing |
| `@type-editor-compat/collab` | Collaborative editing |
| `@type-editor-compat/markdown` | Markdown parsing/serialization |
| `@type-editor-compat/schema` | Basic schema and list nodes |
| `@type-editor-compat/decoration` | Decorations for view customization |
| `@type-editor-compat/changeset` | Change tracking |
| `@type-editor-compat/search` | Search and replace |
| `@type-editor-compat/example-setup` | Quick setup utilities |
| `@type-editor-compat/input` | Input handling utilities |
| `@type-editor-compat/selection-util` | Selection utilities |
| `@type-editor-compat/dom-util` | DOM utilities |
| `@type-editor-compat/dom-coords-util` | DOM coordinate utilities |
| `@type-editor-compat/dom-change-util` | DOM change utilities |
| `@type-editor-compat/test-builder` | Test utilities |

## Technical Approach

Each compat module:

1. **Imports base classes** from `@type-editor/*`
2. **Defines local type aliases** for concrete types (`EditorState`, `Transaction`, etc.)
3. **Forward declares `EditorView`** where needed (to avoid circular dependencies)
4. **Overrides interface types** like `EditorProps`, `PluginSpec`, `MenuItemSpec` with concrete types
5. **Re-exports everything** from the base module

Example from `@type-editor-compat/commands`:

```typescript
import type {
    EditorState as BaseEditorState,
    Transaction as BaseTransaction,
} from '@type-editor/state';

// Define concrete types locally
export type EditorState = BaseEditorState;
export type Transaction = BaseTransaction;

// Forward declare EditorView
export interface EditorView {
    readonly state: EditorState;
    dispatch(tr: Transaction): void;
    // ...
}

// Re-export commands
export { deleteSelection, joinBackward, /* ... */ } from '@type-editor/commands';

// Override Command type with concrete signatures
export type Command = (
    state: EditorState,
    dispatch?: (tr: Transaction) => void,
    view?: EditorView
) => boolean;
```

This approach:
- Has zero runtime overhead (same class instances)
- Maintains full type safety for consumers
- Is easy to maintain (minimal boilerplate)
- Works correctly with `instanceof` checks

