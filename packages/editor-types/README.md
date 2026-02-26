# @type-editor/editor-types

Common TypeScript type definitions for the Type Editor.

This module provides shared interfaces, types, and enums used across the Type Editor packages. It defines the core contracts that other modules implement, enabling better separation of concerns and avoiding circular dependencies between packages.

## Installation

```bash
npm install @type-editor/editor-types
```

## Overview

This package exports type definitions organized into three main categories:

### State Types

Type definitions related to editor state management:

- **Editor State**: `PmEditorState`, `EditorStateConfig`, `EditorStateDto`, `StateJSON`
- **Transactions**: `PmTransaction`
- **Plugins**: `PmPlugin`, `PmPluginKey`, `PluginSpec`, `PluginView`, `StateField`
- **Selection**: `PmSelection`, `PmSelectionRange`, `SelectionBookmark`, `SelectionJSON`

### Transform Types

Type definitions for document transformations:

- **Mapping**: `Mappable`, `MapResult`, `PmMapping`
- **Steps**: `PmStep`, `PmStepMap`, `PmStepResult`, `StepJSON`
- **Document**: `TransformDocument`
- **Attributes**: `AttrValue`

### View Types

Type definitions for the editor view layer:

- **Editor View**: `PmEditorView`, `DirectEditorProps`, `EditorProps`, `NodeViewSet`
- **DOM**: `DOMSelectionRange`, `DOMEventMap`, `PmDOMObserver`
- **Decorations**: `PmDecoration`, `DecorationSource`, `DecorationSpec`, `DecorationType`, `DecorationWidgetOptions`, `InlineDecorationOptions`, `NodeDecorationOptions`
- **Node Views**: `NodeView`, `NodeViewConstructor`, `MarkView`, `MarkViewConstructor`, `PmViewDesc`, `PmNodeViewDesc`, `ViewMutationRecord`
- **Input Handling**: `PmInputState`, `PmDragging`, `PmMouseDown`
- **Selection State**: `PmSelectionState`

### Enums

- **ViewDescType**: Enum for view descriptor types (`VIEW`, `NODE`, `MARK`, `COMPOSITION`, `TEXT`, `WIDGET`, `CUSTOM`, `TRAILING_HACK`)
- **ViewDirtyState**: Enum for tracking view dirty states (`NOT_DIRTY`, `CHILD_DIRTY`, `CONTENT_DIRTY`, `NODE_DIRTY`)

## Usage

```typescript
import type {
  PmEditorState,
  PmEditorView,
  PmTransaction,
  PmPlugin,
  NodeView
} from '@type-editor/editor-types';

import { ViewDescType, ViewDirtyState } from '@type-editor/editor-types';

// Use types for function signatures
function handleTransaction(
  view: PmEditorView, 
  tr: PmTransaction
): PmEditorState {
  return view.state.apply(tr);
}

// Use enums for comparisons
if (dirtyState === ViewDirtyState.NODE_DIRTY) {
  // Recreate the entire node
}
```

## License

MIT

