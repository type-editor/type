[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/model](../../../README.md) / [elements/Fragment](../README.md) / Fragment

# Class: Fragment

Defined in: [packages/model/src/elements/Fragment.ts:43](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/elements/Fragment.ts#L43)

A fragment represents a node's collection of child nodes.

Like nodes, fragments are persistent data structures, and you
should not mutate them or their content. Rather, you create new
instances whenever needed. The API tries to make this easy.

Fragments are used to store the content of block nodes and the entire
document. They provide efficient operations for accessing, comparing,
and manipulating sequences of nodes while maintaining immutability.

Key characteristics:

- Immutable: All modification methods return new Fragment instances
- Efficient: Adjacent text nodes with the same marks are automatically merged
- Persistent: Safe to share between different parts of the application
- Size-aware: Tracks total size for efficient position calculations

## Example

```typescript
// Create a fragment from an array of nodes
const fragment = Fragment.fromArray([node1, node2, node3]);

// Extract a sub-fragment
const subFragment = fragment.cut(5, 15);

// Iterate over children
fragment.forEach((node, offset, index) => {
  console.log(`Node ${index} at offset ${offset}`);
});
```

## Implements

- [`PmElement`](../../../types/elements/PmElement/interfaces/PmElement.md)

## Constructors

### Constructor

```ts
new Fragment(content, size?): Fragment;
```

Defined in: [packages/model/src/elements/Fragment.ts:86](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/elements/Fragment.ts#L86)

Creates a new Fragment instance.

#### Parameters

| Parameter | Type                                            | Description                                                                                                                                                                                                                        |
| --------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content` | readonly [`Node`](../../Node/classes/Node.md)[] | The child nodes in this fragment. Must be a readonly array of PmNode instances.                                                                                                                                                    |
| `size?`   | `number`                                        | Optional. The total size of the fragment (sum of all child node sizes). If not provided, it will be calculated automatically by summing all child node sizes. Providing this value improves performance by avoiding recalculation. |

#### Returns

`Fragment`

## Accessors

### childCount

#### Get Signature

```ts
get childCount(): number;
```

Defined in: [packages/model/src/elements/Fragment.ts:178](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/elements/Fragment.ts#L178)

The number of child nodes in this fragment.

This returns the count of direct children, not the total number of
descendant nodes. For example, a fragment with 3 paragraph nodes
(each containing text nodes) would have a childCount of 3.

##### Example

```typescript
console.log(`Fragment has ${fragment.childCount} children`);
for (let i = 0; i < fragment.childCount; i++) {
  const child = fragment.child(i);
}
```

##### Returns

`number`

The number of immediate child nodes in this fragment.

---

### content

#### Get Signature

```ts
get content(): readonly Node[];
```

Defined in: [packages/model/src/elements/Fragment.ts:107](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/elements/Fragment.ts#L107)

Returns the readonly array of child nodes in this fragment.

##### Returns

readonly [`Node`](../../Node/classes/Node.md)[]

A readonly array containing all child nodes

---

### elementType

#### Get Signature

```ts
get elementType(): ElementType;
```

Defined in: [packages/model/src/elements/Fragment.ts:98](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/elements/Fragment.ts#L98)

##### Returns

[`ElementType`](../../ElementType/enumerations/ElementType.md)

#### Implementation of

[`PmElement`](../../../types/elements/PmElement/interfaces/PmElement.md).[`elementType`](../../../types/elements/PmElement/interfaces/PmElement.md#property-elementtype)

---

### firstChild

#### Get Signature

```ts
get firstChild(): Node;
```

Defined in: [packages/model/src/elements/Fragment.ts:137](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/elements/Fragment.ts#L137)

The first child of the fragment, or `null` if it is empty.

This is a convenience property for accessing the first child without
needing to check the fragment's length or use array indexing.

##### Example

```typescript
const first = fragment.firstChild;
if (first && first.type.name === "paragraph") {
  console.log("First child is a paragraph");
}
```

##### Returns

[`Node`](../../Node/classes/Node.md)

The first child node, or null if the fragment has no children.

---

### lastChild

#### Get Signature

```ts
get lastChild(): Node;
```

Defined in: [packages/model/src/elements/Fragment.ts:157](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/elements/Fragment.ts#L157)

The last child of the fragment, or `null` if it is empty.

This is a convenience property for accessing the last child without
needing to check the fragment's length or calculate the last index.

##### Example

```typescript
const last = fragment.lastChild;
if (last && last.isText) {
  console.log("Last child is text:", last.text);
}
```

##### Returns

[`Node`](../../Node/classes/Node.md)

The last child node, or null if the fragment has no children.

---

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [packages/model/src/elements/Fragment.ts:117](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/elements/Fragment.ts#L117)

Returns the total size of this fragment.
The size is the sum of the sizes of all child nodes.

##### Returns

`number`

The total size of the fragment

---

### empty

#### Get Signature

```ts
get static empty(): Fragment;
```

Defined in: [packages/model/src/elements/Fragment.ts:91](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/elements/Fragment.ts#L91)

##### Returns

`Fragment`

## Methods

### addToEnd()

```ts
addToEnd(node): Fragment;
```

Defined in: [packages/model/src/elements/Fragment.ts:952](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/elements/Fragment.ts#L952)

Creates a new fragment by appending the given node to the end of this fragment.

This maintains immutability by creating a new Fragment instance. The original
fragment remains unchanged.

#### Parameters

| Parameter | Type                                 | Description                                        |
| --------- | ------------------------------------ | -------------------------------------------------- |
| `node`    | [`Node`](../../Node/classes/Node.md) | The node to append. Must be a valid Node instance. |

#### Returns

`Fragment`

A new Fragment with all the original children, followed by the
appended node at the end.

#### Example

```typescript
const newFrag = fragment.addToEnd(footerNode);
// newFrag has all original children, followed by footerNode
```

---

### addToStart()

```ts
addToStart(node): Fragment;
```

Defined in: [packages/model/src/elements/Fragment.ts:932](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/elements/Fragment.ts#L932)

Creates a new fragment by prepending the given node to the beginning of this fragment.

This maintains immutability by creating a new Fragment instance. The original
fragment remains unchanged.

#### Parameters

| Parameter | Type                                 | Description                                         |
| --------- | ------------------------------------ | --------------------------------------------------- |
| `node`    | [`Node`](../../Node/classes/Node.md) | The node to prepend. Must be a valid Node instance. |

#### Returns

`Fragment`

A new Fragment with the node added at the start, followed by all
the original children.

#### Example

```typescript
const newFrag = fragment.addToStart(headerNode);
// newFrag has headerNode as first child, followed by original children
```

---

### append()

```ts
append(other): Fragment;
```

Defined in: [packages/model/src/elements/Fragment.ts:495](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/elements/Fragment.ts#L495)

Creates a new fragment containing the combined content of this fragment and another.
If the last node of this fragment and the first node of the other fragment are
text nodes with the same markup, they will be merged into a single text node.

This method efficiently handles edge cases like empty fragments and performs
text node merging when appropriate to maintain the fragment's normalized state.

#### Parameters

| Parameter | Type       | Description                                                   |
| --------- | ---------- | ------------------------------------------------------------- |
| `other`   | `Fragment` | The fragment to append to this one. Can be an empty fragment. |

#### Returns

`Fragment`

A new Fragment containing the combined content. If either fragment is
empty, returns the other fragment unchanged for efficiency.

#### Example

```typescript
const frag1 = Fragment.from([textNode("Hello")]);
const frag2 = Fragment.from([textNode(" world")]);
const combined = frag1.append(frag2);
// If text nodes have same marks, results in single text node: "Hello world"
```

---

### child()

```ts
child(index): Node;
```

Defined in: [packages/model/src/elements/Fragment.ts:694](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/elements/Fragment.ts#L694)

Retrieves the child node at the given index.

This method provides array-like access to child nodes with bounds checking.
For unchecked access, use `maybeChild()` instead.

#### Parameters

| Parameter | Type     | Description                                                                         |
| --------- | -------- | ----------------------------------------------------------------------------------- |
| `index`   | `number` | The zero-based index of the child node to retrieve. Must be within [0, childCount). |

#### Returns

[`Node`](../../Node/classes/Node.md)

The child node at the specified index.

#### Throws

If the index is out of range (negative or \>= childCount).

#### Example

```typescript
const firstChild = fragment.child(0);
const lastChild = fragment.child(fragment.childCount - 1);
```

---

### cut()

```ts
cut(from, to?): Fragment;
```

Defined in: [packages/model/src/elements/Fragment.ts:540](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/elements/Fragment.ts#L540)

Extracts a sub-fragment between the given positions, creating a new fragment
containing only the content within the specified range. Nodes that are partially
within the range will be cut to include only the relevant portion.

This method intelligently handles partial node overlaps by recursively cutting
child nodes when necessary. Returns this fragment unchanged if the range matches
the entire fragment (optimization).

#### Parameters

| Parameter | Type     | Description                                                                                                                            |
| --------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `from`    | `number` | The starting position (inclusive) of the sub-fragment. Position 0 is before the first character.                                       |
| `to`      | `number` | The ending position (exclusive) of the sub-fragment. Default is the fragment's size. If `to` equals `from`, returns an empty fragment. |

#### Returns

`Fragment`

A new Fragment containing the content between from and to. Returns this
fragment unchanged if from is 0 and to is the fragment size.

#### Example

```typescript
// Extract characters 5-15 from a fragment
const subFrag = fragment.cut(5, 15);

// Extract from position 10 to end
const tailFrag = fragment.cut(10);
```

---

### cutByIndex()

```ts
cutByIndex(from, to): Fragment;
```

Defined in: [packages/model/src/elements/Fragment.ts:591](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/elements/Fragment.ts#L591)

Creates a sub-fragment by extracting child nodes between the given indices.
Unlike `cut()`, this operates on child node indices rather than positions.

This is useful when you know the exact child indices you want to extract
rather than working with absolute positions. More efficient than `cut()` when
you already have index information.

#### Parameters

| Parameter | Type     | Description                                                                     |
| --------- | -------- | ------------------------------------------------------------------------------- |
| `from`    | `number` | The starting child index (inclusive). Use 0 for the first child.                |
| `to`      | `number` | The ending child index (exclusive). If equal to `from`, returns Fragment.EMPTY. |

#### Returns

`Fragment`

A new Fragment containing children from index `from` to `to`. Returns this
fragment unchanged if extracting all children.

#### Example

```typescript
// Extract children 2, 3, and 4 (indices 2-5)
const subFrag = fragment.cutByIndex(2, 5);

// Extract all but first and last children
const middle = fragment.cutByIndex(1, fragment.childCount - 1);
```

---

### descendants()

```ts
descendants(callbackFunc): void;
```

Defined in: [packages/model/src/elements/Fragment.ts:977](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/elements/Fragment.ts#L977)

Invokes the given callback for every descendant node in the entire fragment.
This is equivalent to calling `nodesBetween(0, this.size, callback)`.

This is a convenience method for traversing all nodes in the fragment without
specifying explicit start and end positions.

#### Parameters

| Parameter      | Type                                                      | Description                                                                                                                                                                                                                                                                                                                 |
| -------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `callbackFunc` | (`node`, `pos`, `parent`, `index`) => `boolean` \| `void` | Function called for each descendant node. Receives: - node: The current node being visited - pos: The position relative to the start of the fragment - parent: The parent node (or null if at fragment level) - index: The index of the node within its parent Return `false` to prevent traversal of this node's children. |

#### Returns

`void`

#### Example

```typescript
fragment.descendants((node, pos) => {
  console.log(`Node ${node.type.name} at position ${pos}`);
});
```

---

### eq()

```ts
eq(other): boolean;
```

Defined in: [packages/model/src/elements/Fragment.ts:664](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/elements/Fragment.ts#L664)

Compares this fragment to another fragment for equality.
Two fragments are equal if they have the same number of children
and all corresponding child nodes are equal.

This performs a deep equality check by comparing each child node
using the node's own `eq()` method.

#### Parameters

| Parameter | Type       | Description                                                |
| --------- | ---------- | ---------------------------------------------------------- |
| `other`   | `Fragment` | The fragment to compare with. Must be a Fragment instance. |

#### Returns

`boolean`

True if the fragments are equal (same number of children and all
corresponding children are equal), false otherwise.

#### Example

```typescript
if (fragment1.eq(fragment2)) {
  console.log("Fragments are equal");
}
```

---

### findDiffEnd()

```ts
findDiffEnd(
   other,
   pos?,
   otherPos?): DiffPosition;
```

Defined in: [packages/model/src/elements/Fragment.ts:805](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/elements/Fragment.ts#L805)

Finds the first position, searching from the end, at which this fragment and
another fragment differ. Since the position may not be the same in both fragments,
returns an object with separate positions for each fragment.

This method is useful for finding the common suffix between two fragments,
which is important for efficient diff algorithms and change tracking.

#### Parameters

| Parameter  | Type       | Default value | Description                                                                                                                                       |
| ---------- | ---------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `other`    | `Fragment` | `undefined`   | The fragment to compare with. Must be a Fragment instance.                                                                                        |
| `pos`      | `number`   | `-1`          | Optional ending position in this fragment. Default is -1, which means the fragment's size. Positions are measured from the start of the fragment. |
| `otherPos` | `number`   | `-1`          | Optional ending position in the other fragment. Default is -1, which means that fragment's size.                                                  |

#### Returns

[`DiffPosition`](../../../types/diff/DiffPosition/interfaces/DiffPosition.md)

An object with `selfPos` and `otherPos` properties indicating where the
fragments differ when searching backwards, or null if they are identical
from the end up to the start of the shorter fragment.

#### Example

```typescript
const diff = fragment1.findDiffEnd(fragment2);
if (diff) {
  console.log(
    `Diff in fragment1 at ${diff.selfPos}, in fragment2 at ${diff.otherPos}`,
  );
}
```

---

### findDiffStart()

```ts
findDiffStart(other, pos?): number;
```

Defined in: [packages/model/src/elements/Fragment.ts:776](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/elements/Fragment.ts#L776)

Finds the first position at which this fragment and another fragment differ.
Searches from the beginning of both fragments.

This method performs a recursive comparison, descending into node content
when nodes have the same markup. It's useful for efficiently finding where
two document structures diverge.

#### Parameters

| Parameter | Type       | Default value | Description                                                                                                                |
| --------- | ---------- | ------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `other`   | `Fragment` | `undefined`   | The fragment to compare with. Must be a Fragment instance.                                                                 |
| `pos`     | `number`   | `0`           | Optional starting position offset for the comparison. Default is 0 (start of fragment). Used to adjust returned positions. |

#### Returns

`number`

The position where the fragments first differ, or null if they are
identical up to the end of the shorter fragment.

#### Example

```typescript
const pos = fragment1.findDiffStart(fragment2);
if (pos !== null) {
  console.log(`Fragments differ at position ${pos}`);
}
```

---

### findIndex()

```ts
findIndex(pos): FragmentPosition;
```

Defined in: [packages/model/src/elements/Fragment.ts:837](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/elements/Fragment.ts#L837)

**`Internal`**

Finds the child index and offset corresponding to a given absolute position
in this fragment.

This method converts an absolute position (measured from the start of the
fragment) into a child index and the offset where that child starts. This
is useful for operations that need to work with child indices rather than
absolute positions.

#### Parameters

| Parameter | Type     | Description                                                                                                                           |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `pos`     | `number` | The absolute position within the fragment. Position 0 is before the first character, and position `size` is after the last character. |

#### Returns

[`FragmentPosition`](../../../types/elements/FragmentPosition/interfaces/FragmentPosition.md)

An object containing: - `index`: The index of the child node containing or following the position - `offset`: The absolute position where that child node starts

#### Throws

If the position is outside the fragment bounds (\< 0 or \> size).

#### Example

```typescript
// For a fragment with children of sizes [5, 3, 7]
const result = fragment.findIndex(8);
// Returns: { index: 2, offset: 8 }
// Position 8 is in the third child (index 2), which starts at offset 8
```

---

### forEach()

```ts
forEach(callbackFunc): void;
```

Defined in: [packages/model/src/elements/Fragment.ts:746](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/elements/Fragment.ts#L746)

Iterates over every child node in the fragment, invoking a callback for each.

This method provides an easy way to process all direct children without
manually managing indices or positions. The callback receives both the node
and its position information.

#### Parameters

| Parameter      | Type                                  | Description                                                                                                                                                                                                                            |
| -------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `callbackFunc` | (`node`, `offset`, `index`) => `void` | Function to call for each child node. Receives: - node: The current child node being visited - offset: The position offset where this node starts within the fragment - index: The zero-based index of this node in the children array |

#### Returns

`void`

#### Example

```typescript
fragment.forEach((node, offset, index) => {
  console.log(`Child ${index} at offset ${offset}:`, node.type.name);
});
```

---

### maybeChild()

```ts
maybeChild(index): Node;
```

Defined in: [packages/model/src/elements/Fragment.ts:723](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/elements/Fragment.ts#L723)

Retrieves the child node at the given index, returning null if it doesn't exist.
This is a safe alternative to `child()` that doesn't throw errors.

Use this method when you're not sure if the index is valid, or when you want
to avoid try-catch blocks for out-of-bounds access.

#### Parameters

| Parameter | Type     | Description                                                            |
| --------- | -------- | ---------------------------------------------------------------------- |
| `index`   | `number` | The zero-based index of the child node to retrieve. Can be any number. |

#### Returns

[`Node`](../../Node/classes/Node.md)

The child node at the specified index, or null if the index is out of
range or the fragment is empty.

#### Example

```typescript
const child = fragment.maybeChild(10);
if (child) {
  console.log("Child exists:", child);
} else {
  console.log("No child at index 10");
}
```

---

### nodesBetween()

```ts
nodesBetween(
   from,
   to,
   callbackFunc,
   nodeStart?,
   parent?): void;
```

Defined in: [packages/model/src/elements/Fragment.ts:392](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/elements/Fragment.ts#L392)

Invokes a callback for all descendant nodes between the given two positions
(relative to start of this fragment). Traversal stops descending into a node
when the callback returns `false`.

This method performs a depth-first traversal of the fragment's node tree,
visiting each node that intersects with the specified range. The callback
can control whether to descend into each node's children.

#### Parameters

| Parameter      | Type                                                        | Default value | Description                                                                                                                                                                                                                                                                                                                                                                              |
| -------------- | ----------------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`         | `number`                                                    | `undefined`   | The starting position (inclusive) for the range to traverse. Position 0 is before the first character of the fragment.                                                                                                                                                                                                                                                                   |
| `to`           | `number`                                                    | `undefined`   | The ending position (exclusive) for the range to traverse. Must be greater than or equal to `from`.                                                                                                                                                                                                                                                                                      |
| `callbackFunc` | (`node`, `start`, `parent`, `index`) => `boolean` \| `void` | `undefined`   | Function called for each node in the range. Receives: - node: The current node being visited - start: The absolute position where this node starts - parent: The parent node (or null if at fragment level) - index: The index of the node within its parent's children Return `false` to prevent descending into this node's children, or any other value to continue normal traversal. |
| `nodeStart`    | `number`                                                    | `0`           | Optional offset to add to all position calculations. Used internally for recursive calls. Default is 0.                                                                                                                                                                                                                                                                                  |
| `parent?`      | [`Node`](../../Node/classes/Node.md)                        | `undefined`   | Optional parent node context for the traversal. Used internally to track the parent hierarchy during recursive descent.                                                                                                                                                                                                                                                                  |

#### Returns

`void`

#### Example

```typescript
// Find all text nodes in a range
fragment.nodesBetween(5, 20, (node, pos) => {
  if (node.isText) {
    console.log(`Text at ${pos}: "${node.text}"`);
  }
});

// Stop at block boundaries
fragment.nodesBetween(0, fragment.size, (node, pos) => {
  if (node.isBlock) {
    console.log(`Block at ${pos}`);
    return false; // Don't descend into block content
  }
});
```

---

### replaceChild()

```ts
replaceChild(index, node): Fragment;
```

Defined in: [packages/model/src/elements/Fragment.ts:630](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/elements/Fragment.ts#L630)

Creates a new fragment with the child node at the given index replaced by a new node.
If the current node is identical to the new node, returns this fragment unchanged.

This method maintains immutability by creating a new fragment with the updated content
rather than modifying the existing fragment.

#### Parameters

| Parameter | Type                                 | Description                                                                |
| --------- | ------------------------------------ | -------------------------------------------------------------------------- |
| `index`   | `number`                             | The index of the child node to replace. Must be within [0, childCount).    |
| `node`    | [`Node`](../../Node/classes/Node.md) | The new node to insert at the given index. Can be any valid Node instance. |

#### Returns

`Fragment`

A new Fragment with the replaced child node. Returns this fragment unchanged
if the node at the index is identical (by reference) to the new node.

#### Throws

If the index is out of bounds (negative or \>= childCount).

#### Example

```typescript
// Replace the second child (index 1)
const newFrag = fragment.replaceChild(1, newNode);

// Original fragment is unchanged
console.log(fragment.child(1) !== newNode); // true
console.log(newFrag.child(1) === newNode); // true
```

---

### textBetween()

```ts
textBetween(
   from,
   to,
   blockSeparator?,
   leafText?): string;
```

Defined in: [packages/model/src/elements/Fragment.ts:451](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/elements/Fragment.ts#L451)

Extracts the text content between the given positions.

This method traverses the fragment and collects text from text nodes and
leaf nodes, optionally inserting separators between block nodes. Useful for
getting a plain text representation of document content.

#### Parameters

| Parameter         | Type                                 | Description                                                                                                                                                                                                                                                                         |
| ----------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`            | `number`                             | The starting position (inclusive) to extract text from. Position 0 is before the first character.                                                                                                                                                                                   |
| `to`              | `number`                             | The ending position (exclusive) to extract text to. Should be between `from` and the fragment's size.                                                                                                                                                                               |
| `blockSeparator?` | `string`                             | Optional string to insert between block nodes (e.g., '\n' for newlines, '\n\n' for paragraph breaks). If null or undefined, no separator is added and block content runs together.                                                                                                  |
| `leafText?`       | `string` \| (`leafNode`) => `string` | Optional text or function to use for leaf nodes: - If a string: That string is used for all leaf nodes (e.g., "[image]") - If a function: Called with each leaf node to compute its text representation - If null/undefined: Falls back to node.type.spec.leafText, or empty string |

#### Returns

`string`

The extracted text content as a string with block separators inserted where specified.

#### Example

```typescript
// Get plain text with newlines between paragraphs
const text = fragment.textBetween(0, fragment.size, "\n");

// Custom leaf node handling
const text2 = fragment.textBetween(0, fragment.size, "\n", (node) => {
  if (node.type.name === "image") return "[IMAGE]";
  if (node.type.name === "hard_break") return "\n";
  return "";
});
```

---

### toJSON()

```ts
toJSON(): NodeJSON[];
```

Defined in: [packages/model/src/elements/Fragment.ts:912](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/elements/Fragment.ts#L912)

Creates a JSON-serializable representation of this fragment.

Each child node is converted to JSON by calling its toJSON() method.
Empty fragments return null for efficiency. The resulting JSON can be
deserialized using Fragment.fromJSON().

#### Returns

[`NodeJSON`](../../../types/elements/NodeJSON/interfaces/NodeJSON.md)[]

An array of node JSON objects, or null if the fragment is empty.

#### Example

```typescript
const json = fragment.toJSON();
// Later, restore from JSON:
const restored = Fragment.fromJSON(schema, json);
```

---

### toString()

```ts
toString(): string;
```

Defined in: [packages/model/src/elements/Fragment.ts:879](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/elements/Fragment.ts#L879)

Returns a debugging string representation of this fragment.
The output format is `<node1, node2, ...>` where each node's toString() is called.

This is useful for debugging and logging, providing a readable representation
of the fragment's structure.

#### Returns

`string`

A string representation of the fragment in the format "<child1, child2, ...>",
or "<>" for an empty fragment.

#### Example

```typescript
console.log(fragment.toString());
// Output: <paragraph("Hello"), paragraph("World")>
```

---

### from()

```ts
static from(nodes?): Fragment;
```

Defined in: [packages/model/src/elements/Fragment.ts:240](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/elements/Fragment.ts#L240)

Creates a fragment from various input types that can be interpreted as a set of nodes.

This is a convenience method that handles multiple input types:

- `null` or `undefined`: Returns Fragment.EMPTY
- `Fragment`: Returns the fragment itself (identity operation, no copy made)
- `Node`: Returns a fragment containing that single node
- `Array<Node>`: Returns a fragment containing those nodes (with text nodes merged)

This method is particularly useful when you need to accept flexible input types
in your API, as it normalizes them all to Fragment instances.

#### Parameters

| Parameter | Type                                                                                                     | Description                                                                                                  |
| --------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `nodes?`  | \| `Fragment` \| [`Node`](../../Node/classes/Node.md) \| readonly [`Node`](../../Node/classes/Node.md)[] | The input to convert to a fragment. Can be null, undefined, a Fragment, a single Node, or an array of Nodes. |

#### Returns

`Fragment`

A Fragment instance representing the input.

#### Throws

If the input cannot be converted to a Fragment. Also provides
a helpful hint if multiple versions of prosemirror-model are detected.

#### Example

```typescript
// All these are valid:
const frag1 = Fragment.from(null); // Fragment.EMPTY
const frag2 = Fragment.from(existingFrag); // Same fragment
const frag3 = Fragment.from(singleNode); // Fragment with one node
const frag4 = Fragment.from([node1, node2]); // Fragment with multiple nodes
```

---

### fromArray()

```ts
static fromArray(array): Fragment;
```

Defined in: [packages/model/src/elements/Fragment.ts:304](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/elements/Fragment.ts#L304)

Builds a fragment from an array of nodes. Automatically merges adjacent
text nodes that have the same markup (marks) into single text nodes.

This method is more efficient than creating a fragment and then calling
append() multiple times, as it performs text node merging in a single pass.
Empty arrays return Fragment.EMPTY for efficiency.

#### Parameters

| Parameter | Type                                            | Description                                                                                           |
| --------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `array`   | readonly [`Node`](../../Node/classes/Node.md)[] | The array of nodes to create a fragment from. Can be empty, in which case Fragment.EMPTY is returned. |

#### Returns

`Fragment`

A new Fragment instance with adjacent text nodes merged where possible.

#### Example

```typescript
// Text nodes with same marks will be merged
const text1 = schema.text("Hello", [boldMark]);
const text2 = schema.text(" world", [boldMark]);
const fragment = Fragment.fromArray([text1, text2]);
// Results in single text node: "Hello world" with bold mark

// Different marks - no merging
const text3 = schema.text("!", [italicMark]);
const fragment2 = Fragment.fromArray([text1, text2, text3]);
// Results in two nodes: "Hello world" (bold) and "!" (italic)
```

---

### fromJSON()

```ts
static fromJSON(schema, value?): Fragment;
```

Defined in: [packages/model/src/elements/Fragment.ts:203](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/elements/Fragment.ts#L203)

Deserializes a fragment from its JSON representation.

This static method reconstructs a Fragment from JSON data, typically
obtained from a previous call to `toJSON()`. Each node in the JSON
array is deserialized using the provided schema.

#### Parameters

| Parameter | Type                                                                    | Description                                                                                                  |
| --------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `schema`  | [`Schema`](../../../schema/Schema/classes/Schema.md)                    | The schema to use for deserializing nodes. Must match the schema used when the fragment was serialized.      |
| `value?`  | [`NodeJSON`](../../../types/elements/NodeJSON/interfaces/NodeJSON.md)[] | Optional array of node JSON objects to deserialize. If not provided, null, or empty, returns Fragment.EMPTY. |

#### Returns

`Fragment`

A Fragment instance created from the JSON data.

#### Throws

If value is provided but is not an array.

#### Example

```typescript
const json = fragment.toJSON();
// Later, restore from JSON
const restored = Fragment.fromJSON(schema, json);
```
