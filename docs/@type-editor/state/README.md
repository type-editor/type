[**Type Editor**](../../README.md)

---

[Type Editor](../../index.md) / @type-editor/state

# @type-editor/state

This is a refactored version of the [prosemirror-state](https://github.com/ProseMirror/prosemirror-state) module.

This module implements the
state object of a Type Editor, along with the representation of the
selection and the plugin abstraction.

## Installation

```bash
npm install @type-editor/state
```

## Editor State

Type Editor keeps all editor state in a single immutable object. The state is a
persistent data structure—it isn't updated directly, but rather a new state
value is computed from an old one using the `apply` method with transactions.

A state holds a number of built-in fields, and plugins can define additional fields.

### EditorState

The main class representing the entire state of an editor:

```typescript
import { EditorState } from "@type-editor/state";
import { Schema } from "@type-editor/model";

// Create a new editor state
const state = EditorState.create({
  schema: mySchema,
  doc: myDocument, // optional: initial document
  selection: mySelection, // optional: initial selection
  plugins: [myPlugin], // optional: array of plugins
});

// Access state properties
state.doc; // The current document
state.selection; // The current selection
state.storedMarks; // Marks to apply to next input
state.schema; // The document schema

// Create a new state by applying a transaction
const newState = state.apply(transaction);
```

### EditorStateConfiguration

Configuration object that wraps the part of a state object that stays the same
across transactions, including:

- `fields` - Array of field descriptors for built-in and plugin fields
- `plugins` - Array of active plugins
- `pluginsMap` - Map of plugin keys to plugin instances
- `schema` - The document schema

## Transaction

Transactions are used to update the editor state. They track changes to the
document (as a subclass of `Transform`), but also other state changes like
selection updates and stored marks adjustments.

```typescript
// Create a transaction from the current state
const tr = state.tr;

// Chain transaction methods
tr.insertText("Hello")
  .setSelection(TextSelection.create(tr.doc, 5))
  .scrollIntoView();

// Apply the transaction to create a new state
const newState = state.apply(tr);
```

### Metadata

Transactions can carry metadata properties that describe what the transaction
represents. The editor view uses metadata like:

- `'pointer'` - Set to `true` for selections caused by mouse/touch input
- `'composition'` - ID for transactions caused by composed DOM input
- `'uiEvent'` - May be `'paste'`, `'cut'`, or `'drop'`

```typescript
tr.setMeta("myPlugin", { someData: true });
tr.getMeta("myPlugin"); // { someData: true }
```

## Selection

A Type Editor selection can be one of several types. This module defines types
for classical text selections (of which cursors are a special case), node
selections (where a specific document node is selected), and all-document
selections. It is possible to extend the editor with custom selection types.

### Selection (Base Class)

The abstract superclass for all selection types. Provides common functionality
for managing anchor, head, and ranges.

```typescript
import { Selection } from "@type-editor/state";

// Create a selection at the start of a document
const sel = Selection.atStart(doc);

// Create a selection at the end of a document
const sel = Selection.atEnd(doc);

// Find a valid selection near a position
const sel = Selection.near(resolvedPos);
```

### TextSelection

Represents a classical text selection with anchor (immobile side) and head
(moving side). When anchor equals head, it represents a cursor position.

```typescript
import { TextSelection } from "@type-editor/state";

// Create a text selection
const sel = TextSelection.create(doc, from, to);

// Create a cursor (collapsed selection)
const cursor = TextSelection.create(doc, pos);

// Check if selection is a cursor
if (sel.$cursor) {
  // Selection is a cursor
}
```

### NodeSelection

A selection that points at a single node. All nodes marked as `selectable` in
their node spec can be the target of a node selection.

```typescript
import { NodeSelection } from "@type-editor/state";

// Create a node selection
const sel = NodeSelection.create(doc, pos);

// Access the selected node
sel.node; // The selected node
```

### AllSelection

Represents selecting the entire document. Useful when you need to select all
content, including non-inline elements that cannot be part of a text selection.

```typescript
import { AllSelection } from "@type-editor/state";

// Select the entire document
const sel = new AllSelection(doc);
```

### SelectionRange

Represents a selected range with start (`$from`) and end (`$to`) positions.
Most selections consist of a single range.

```typescript
import { SelectionRange } from "@type-editor/state";

const range = new SelectionRange($from, $to);
range.$from; // Starting position
range.$to; // Ending position
```

## Plugin System

To make it easy to package and enable extra editor functionality, Type Editor
has a plugin system. Plugins are part of the editor state and may influence
both the state and the view.

### Plugin

Plugins bundle functionality that can be added to an editor. They can:

- Define custom state fields
- Provide editor props (like event handlers)
- Create view components
- Filter or modify transactions

```typescript
import { Plugin, PluginKey } from "@type-editor/state";

const myPluginKey = new PluginKey("myPlugin");

const myPlugin = new Plugin({
  key: myPluginKey,

  // Define plugin state
  state: {
    init(config, state) {
      return { counter: 0 };
    },
    apply(tr, value, oldState, newState) {
      return { counter: value.counter + 1 };
    },
  },

  // Define editor props
  props: {
    handleKeyDown(view, event) {
      // Handle key events
      return false;
    },
  },

  // Define a view component
  view(editorView) {
    return {
      update(view, prevState) {},
      destroy() {},
    };
  },
});

// Access plugin state
const pluginState = myPluginKey.getState(editorState);
```

### PluginKey

A key used to tag plugins so they can be found given an editor state. Assigning
a key means only one plugin of that type can be active in a state.

```typescript
import { PluginKey } from "@type-editor/state";

const key = new PluginKey("uniqueName");

// Get the plugin instance from state
const plugin = key.get(state);

// Get the plugin's state from editor state
const pluginState = key.getState(state);
```

## Commands

Commands are functions that determine whether they apply to a state and, if so,
perform their effect by dispatching a transaction.

```typescript
import type { Command, DispatchFunction } from "@type-editor/state";

const myCommand: Command = (state, dispatch, view) => {
  // Check if command can be applied
  if (!canApply(state)) {
    return false;
  }

  // If dispatch is provided, perform the action
  if (dispatch) {
    const tr = state.tr.insertText("Hello");
    dispatch(tr);
  }

  return true;
};
```

## API Reference

### Exports

| Export                     | Type  | Description                        |
| -------------------------- | ----- | ---------------------------------- |
| `EditorState`              | Class | The main editor state class        |
| `EditorStateConfiguration` | Type  | Configuration for editor state     |
| `Transaction`              | Class | Represents state changes           |
| `Selection`                | Class | Base class for selections          |
| `TextSelection`            | Class | Text/cursor selection              |
| `NodeSelection`            | Class | Single node selection              |
| `AllSelection`             | Class | Whole document selection           |
| `SelectionRange`           | Class | A selected range                   |
| `SelectionFactory`         | Class | Factory for creating selections    |
| `Plugin`                   | Class | Plugin implementation              |
| `PluginKey`                | Class | Key for identifying plugins        |
| `FieldDesc`                | Class | Field descriptor for state fields  |
| `Command`                  | Type  | Command function type              |
| `DispatchFunction`         | Type  | Transaction dispatch function type |

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

[editor-state/EditorState](editor-state/EditorState/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[editor-state/FieldDesc](editor-state/FieldDesc/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[plugin/Plugin](plugin/Plugin/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[plugin/PluginBase](plugin/PluginBase/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[plugin/PluginKey](plugin/PluginKey/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[selection/AllSelection](selection/AllSelection/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[selection/bookmarks/AllBookmark](selection/bookmarks/AllBookmark/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[selection/bookmarks/NodeBookmark](selection/bookmarks/NodeBookmark/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[selection/bookmarks/TextBookmark](selection/bookmarks/TextBookmark/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[selection/NodeSelection](selection/NodeSelection/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[selection/Selection](selection/Selection/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[selection/SelectionFactory](selection/SelectionFactory/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[selection/SelectionRange](selection/SelectionRange/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[selection/SelectionTypeEnum](selection/SelectionTypeEnum/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[selection/TextSelection](selection/TextSelection/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[Transaction](Transaction/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/Command](types/Command/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
</tbody>
</table>
