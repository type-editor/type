# @type-editor/util

Utility functions for traversing and searching the document tree in Type Editor.

## Installation

```bash
npm install @type-editor/util
# or
pnpm add @type-editor/util
```

## Overview

This package provides utility functions for navigating and querying the document tree structure. It offers tools for finding parent nodes based on predicates or node types, which is essential for building editor commands and extensions.

## API

### Functions

#### `findParent(selection, predicate)`

Finds the nearest ancestor node in the document tree that satisfies the given predicate.

**Parameters:**
- `selection` - The current editor selection to search from
- `predicate` - A callback function that tests each ancestor node

**Returns:** `FindParentResult | null`

```typescript
import { findParent } from '@type-editor/util';

// Find the nearest list item ancestor
const listItem = findParent(selection, node => node.type.name === 'list_item');

if (listItem) {
  console.log('Found list item at position:', listItem.position.pos);
}
```

#### `findParentByType(selection, nodeType)`

Finds the nearest ancestor node of a specific type. A convenience wrapper around `findParent`.

**Parameters:**
- `selection` - The current editor selection to search from
- `nodeType` - The node type to search for

**Returns:** `FindParentResult | null`

```typescript
import { findParentByType } from '@type-editor/util';

// Find the nearest paragraph ancestor
const paragraph = findParentByType(selection, schema.nodes.paragraph);
```

#### `findCommonParent(selection)`

Finds the deepest common ancestor node that contains both ends of the selection.

**Parameters:**
- `selection` - The current editor selection

**Returns:** `FindParentResult | null`

```typescript
import { findCommonParent } from '@type-editor/util';

// Get the container of the current selection
const container = findCommonParent(selection);
if (container) {
  console.log('Selection is within:', container.node.type.name);
}
```

#### `isInNodeType(state, nodeType, attrs?)`

Checks if the current selection is within a node of the specified type, optionally matching specific attributes.

**Parameters:**
- `state` - The current editor state
- `nodeType` - The node type to check for
- `attrs` (optional) - Attributes to match against

**Returns:** `boolean`

```typescript
import { isInNodeType } from '@type-editor/util';

// Check if cursor is inside a heading
const inHeading = isInNodeType(state, schema.nodes.heading);

// Check if cursor is inside a level 2 heading
const inH2 = isInNodeType(state, schema.nodes.heading, { level: 2 });
```

### Types

#### `FindParentResult`

Result of a parent node search operation.

```typescript
interface FindParentResult {
  /** The resolved position of the found parent node. */
  position: ResolvedPos;
  /** The parent node that was found. */
  node: PmNode;
}
```

#### `FindCallbackFunction`

A callback function used to find nodes in the document tree.

```typescript
type FindCallbackFunction = (node: PmNode) => boolean;
```

## Dependencies

### Peer Dependencies

- `@type-editor/model` - Document model types and utilities

## License

MIT

