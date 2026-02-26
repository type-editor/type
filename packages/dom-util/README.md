# @type-editor/dom-util

This module was part of the `ProseMirror view module`.

DOM utility functions for the Type Editor.

This module provides low-level DOM manipulation and traversal utilities used internally by the Type Editor. These functions handle common DOM operations like finding element positions, traversing through Shadow DOM boundaries, and working with text ranges.

## Installation

```bash
npm install @type-editor/dom-util
```

## API Reference

### Element Position & Navigation

#### `deepActiveElement(doc: Document): Element | null`

Gets the deeply nested active element, traversing through Shadow DOM boundaries. This function recursively descends into shadow roots to find the actual focused element.

```typescript
import { deepActiveElement } from '@type-editor/dom-util';

const focusedElement = deepActiveElement(document);
if (focusedElement) {
    console.log('Actually focused element:', focusedElement);
}
```

#### `domIndex(node: Node): number`

Gets the zero-based index of a DOM node within its parent's child list.

```typescript
import { domIndex } from '@type-editor/dom-util';

const element = document.getElementById('myElement');
const index = domIndex(element); // Returns position among siblings
```

#### `parentNode(node: Node): Node | null`

Gets the parent node of a DOM node, accounting for Shadow DOM and slot assignments. Handles special cases like slotted elements and DocumentFragment parents.

```typescript
import { parentNode } from '@type-editor/dom-util';

const element = document.getElementById('myElement');
const parent = parentNode(element);
```

### Node Size & Measurement

#### `nodeSize(node: Node): number`

Gets the size of a DOM node. For text nodes, returns the length of the text content. For element nodes, returns the number of child nodes.

```typescript
import { nodeSize } from '@type-editor/dom-util';

const textNode = document.createTextNode('Hello');
const size = nodeSize(textNode); // Returns 5

const element = document.createElement('div');
element.appendChild(document.createElement('span'));
const elemSize = nodeSize(element); // Returns 1
```

### Position Detection

#### `isEquivalentPosition(node: Node, off: number, targetNode: Node, targetOff: number): boolean`

Checks if two DOM positions are equivalent. Scans forward and backward through DOM positions to determine if two positions refer to the same location in the document.

```typescript
import { isEquivalentPosition } from '@type-editor/dom-util';

const textNode = document.createTextNode('Hello');
const parent = textNode.parentNode;
// Position after text node vs. at end of text node
const equivalent = isEquivalentPosition(parent, 1, textNode, 5);
```

#### `isOnEdge(node: Node, offset: number, parent: Node): boolean`

Checks if a position is at the start or end edge of a parent node. Traverses up the DOM tree from the given position to determine if it represents the very beginning or end of the parent node's content.

```typescript
import { isOnEdge } from '@type-editor/dom-util';

const textNode = document.createTextNode('Hello');
const parent = textNode.parentNode;
const isEdge = isOnEdge(textNode, 0, parent); // True if at start
```

### Block Detection

#### `hasBlockDesc(dom: Node): boolean`

Checks if a DOM node has a block-level ViewDesc associated with it. Traverses up the DOM tree to find a ViewDesc, then checks if it represents a block node.

```typescript
import { hasBlockDesc } from '@type-editor/dom-util';

const paragraph = document.querySelector('p');
const isBlock = hasBlockDesc(paragraph);
```

### Text Node Navigation

#### `textNodeBefore(node: Node, offset: number): Text | null`

Finds the text node before a given position in the DOM tree. Traverses the DOM tree backward from the given position to find the nearest preceding text node. Stops at non-editable elements and block boundaries.

```typescript
import { textNodeBefore } from '@type-editor/dom-util';

const element = document.getElementById('myElement');
const textNode = textNodeBefore(element, 1);
```

#### `textNodeAfter(node: Node, offset: number): Text | null`

Finds the text node after a given position in the DOM tree. Traverses the DOM tree forward from the given position to find the nearest following text node. Stops at non-editable elements and block boundaries.

```typescript
import { textNodeAfter } from '@type-editor/dom-util';

const element = document.getElementById('myElement');
const textNode = textNodeAfter(element, 0);
```

### Text Range Utilities

#### `textRange(node: Text, from?: number, to?: number): Range`

Creates or reuses a DOM Range for a text node. This function always returns the same Range object for performance reasons, as DOM Range objects are expensive to create.

```typescript
import { textRange } from '@type-editor/dom-util';

const textNode = document.createTextNode('Hello World');
const range = textRange(textNode, 0, 5); // Selects "Hello"
```

#### `clearReusedRange(): void`

Clears the cached Range object used by `textRange()`. This should be called when you need to ensure the cached Range is properly released.

```typescript
import { textRange, clearReusedRange } from '@type-editor/dom-util';

const range = textRange(textNode, 0, 5);
// ... use range ...
clearReusedRange(); // Clean up when done
```

## License

MIT
