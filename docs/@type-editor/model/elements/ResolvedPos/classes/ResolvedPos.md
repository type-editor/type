[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/model](../../../README.md) / [elements/ResolvedPos](../README.md) / ResolvedPos

# Class: ResolvedPos

Defined in: [packages/model/src/elements/ResolvedPos.ts:22](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/elements/ResolvedPos.ts#L22)

You can [_resolve_](#model.Node.resolve) a position to get more
information about it. Objects of this class represent such a
resolved position, providing various pieces of context
information, and some helper methods.

Throughout this interface, methods that take an optional `depth`
parameter will interpret undefined as `this.depth` and negative
numbers as `this.depth + value`.

## Remarks

The internal path structure stores nodes and positions in triplets:
[node, index, position] for each level of the document tree.

## Constructors

### Constructor

```ts
new ResolvedPos(
   pos,
   path,
   parentOffset): ResolvedPos;
```

Defined in: [packages/model/src/elements/ResolvedPos.ts:80](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/elements/ResolvedPos.ts#L80)

Create a resolved position. Generally, you should use the static `resolve()` or
`resolveCached()` methods instead of calling this constructor directly.

#### Parameters

| Parameter      | Type                                                          | Description                                                                                                                    |
| -------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `pos`          | `number`                                                      | The absolute position that was resolved.                                                                                       |
| `path`         | readonly (`number` \| [`Node`](../../Node/classes/Node.md))[] | Array containing the path from root to this position, stored as triplets of [node, childIndex, position] for each depth level. |
| `parentOffset` | `number`                                                      | The offset this position has into its parent node.                                                                             |

#### Returns

`ResolvedPos`

## Accessors

### depth

#### Get Signature

```ts
get depth(): number;
```

Defined in: [packages/model/src/elements/ResolvedPos.ts:93](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/elements/ResolvedPos.ts#L93)

The number of levels the parent node is from the root.
0 means the position points directly into the root node.

##### Returns

`number`

---

### doc

#### Get Signature

```ts
get doc(): Node;
```

Defined in: [packages/model/src/elements/ResolvedPos.ts:123](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/elements/ResolvedPos.ts#L123)

The root node in which the position was resolved.

##### Returns

[`Node`](../../Node/classes/Node.md)

---

### nodeAfter

#### Get Signature

```ts
get nodeAfter(): Node;
```

Defined in: [packages/model/src/elements/ResolvedPos.ts:141](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/elements/ResolvedPos.ts#L141)

Get the node directly after the position, if any. If the position
points into a text node, only the part of that node after the
position is returned.

##### Returns

[`Node`](../../Node/classes/Node.md)

---

### nodeBefore

#### Get Signature

```ts
get nodeBefore(): Node;
```

Defined in: [packages/model/src/elements/ResolvedPos.ts:159](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/elements/ResolvedPos.ts#L159)

Get the node directly before the position, if any. If the
position points into a text node, only the part of that node
before the position is returned.

##### Returns

[`Node`](../../Node/classes/Node.md)

---

### parent

#### Get Signature

```ts
get parent(): Node;
```

Defined in: [packages/model/src/elements/ResolvedPos.ts:116](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/elements/ResolvedPos.ts#L116)

The parent node that the position points into. Note that even if
a position points into a text node, that node is not considered
the parent—text nodes are ‘flat’ in this model, and have no content.

##### Returns

[`Node`](../../Node/classes/Node.md)

---

### parentOffset

#### Get Signature

```ts
get parentOffset(): number;
```

Defined in: [packages/model/src/elements/ResolvedPos.ts:107](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/elements/ResolvedPos.ts#L107)

The offset of this position into its parent node.

##### Returns

`number`

---

### pos

#### Get Signature

```ts
get pos(): number;
```

Defined in: [packages/model/src/elements/ResolvedPos.ts:100](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/elements/ResolvedPos.ts#L100)

The absolute position in the document that was resolved.

##### Returns

`number`

---

### textOffset

#### Get Signature

```ts
get textOffset(): number;
```

Defined in: [packages/model/src/elements/ResolvedPos.ts:132](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/elements/ResolvedPos.ts#L132)

When this position points into a text node, this returns the
distance between the start of the text node and the position.
Will be zero for positions that point between nodes.

##### Returns

`number`

## Methods

### after()

```ts
after(depth?): number;
```

Defined in: [packages/model/src/elements/ResolvedPos.ts:333](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/elements/ResolvedPos.ts#L333)

The (absolute) position directly after the wrapping node at the
given level, or the original position when `depth` is `this.depth + 1`.

#### Parameters

| Parameter | Type     | Description                                                                                                      |
| --------- | -------- | ---------------------------------------------------------------------------------------------------------------- |
| `depth?`  | `number` | The depth level. Defaults to `this.depth` if undefined. Negative values are interpreted as `this.depth + depth`. |

#### Returns

`number`

The absolute position after the node at the specified depth.

#### Throws

If depth is 0 (no position after root node).

---

### before()

```ts
before(depth?): number;
```

Defined in: [packages/model/src/elements/ResolvedPos.ts:314](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/elements/ResolvedPos.ts#L314)

The (absolute) position directly before the wrapping node at the
given level, or, when `depth` is `this.depth + 1`, the original
position.

#### Parameters

| Parameter | Type     | Description                                                                                                      |
| --------- | -------- | ---------------------------------------------------------------------------------------------------------------- |
| `depth?`  | `number` | The depth level. Defaults to `this.depth` if undefined. Negative values are interpreted as `this.depth + depth`. |

#### Returns

`number`

The absolute position before the node at the specified depth.

#### Throws

If depth is 0 (no position before root node).

---

### blockRange()

```ts
blockRange(other?, pred?): NodeRange;
```

Defined in: [packages/model/src/elements/ResolvedPos.ts:472](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/elements/ResolvedPos.ts#L472)

Returns a range based on the place where this position and the
given position diverge around block content. If both point into
the same textblock, for example, a range around that textblock
will be returned. If they point into different blocks, the range
around those blocks in their shared ancestor is returned. You can
pass in an optional predicate that will be called with a parent
node to see if a range into that parent is acceptable.

#### Parameters

| Parameter | Type                  | Description                                                                                               |
| --------- | --------------------- | --------------------------------------------------------------------------------------------------------- |
| `other?`  | `ResolvedPos`         | The other position to find a block range with. Defaults to this position if not provided.                 |
| `pred?`   | (`node`) => `boolean` | Optional predicate function that accepts a node and returns true if a range into that node is acceptable. |

#### Returns

[`NodeRange`](../../NodeRange/classes/NodeRange.md)

A NodeRange spanning the block content, or null if no valid range can be found.

---

### end()

```ts
end(depth?): number;
```

Defined in: [packages/model/src/elements/ResolvedPos.ts:299](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/elements/ResolvedPos.ts#L299)

The (absolute) position at the end of the node at the given
level.

#### Parameters

| Parameter | Type     | Description                                                                                                      |
| --------- | -------- | ---------------------------------------------------------------------------------------------------------------- |
| `depth?`  | `number` | The depth level. Defaults to `this.depth` if undefined. Negative values are interpreted as `this.depth + depth`. |

#### Returns

`number`

The absolute position at the end of the node at the specified depth.

---

### index()

```ts
index(depth?): number;
```

Defined in: [packages/model/src/elements/ResolvedPos.ts:259](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/elements/ResolvedPos.ts#L259)

The index into the ancestor at the given level. If this points
at the 3rd node in the 2nd paragraph on the top level, for
example, `p.index(0)` is 1 and `p.index(1)` is 2.

#### Parameters

| Parameter | Type     | Description                                                                                                      |
| --------- | -------- | ---------------------------------------------------------------------------------------------------------------- |
| `depth?`  | `number` | The depth level. Defaults to `this.depth` if undefined. Negative values are interpreted as `this.depth + depth`. |

#### Returns

`number`

The child index at the specified depth level.

---

### indexAfter()

```ts
indexAfter(depth?): number;
```

Defined in: [packages/model/src/elements/ResolvedPos.ts:271](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/elements/ResolvedPos.ts#L271)

The index pointing after this position into the ancestor at the
given level.

#### Parameters

| Parameter | Type     | Description                                                                                                      |
| --------- | -------- | ---------------------------------------------------------------------------------------------------------------- |
| `depth?`  | `number` | The depth level. Defaults to `this.depth` if undefined. Negative values are interpreted as `this.depth + depth`. |

#### Returns

`number`

The child index after this position at the specified depth.

---

### marks()

```ts
marks(): readonly Mark[];
```

Defined in: [packages/model/src/elements/ResolvedPos.ts:379](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/elements/ResolvedPos.ts#L379)

Get the marks at this position, factoring in the surrounding
marks' [`inclusive`](#model.MarkSpec.inclusive) property. If the
position is at the start of a non-empty node, the marks of the
node after it (if any) are returned.

#### Returns

readonly [`Mark`](../../Mark/classes/Mark.md)[]

An array of marks active at this position.

#### Remarks

The algorithm prioritizes the node before the position, except when there is no
node before (at the start). Non-inclusive marks are filtered out if they don't
appear in the adjacent node.

---

### marksAcross()

```ts
marksAcross($end): readonly Mark[];
```

Defined in: [packages/model/src/elements/ResolvedPos.ts:425](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/elements/ResolvedPos.ts#L425)

Get the marks after the current position, if any, except those
that are non-inclusive and not present at position `$end`. This
is mostly useful for getting the set of marks to preserve after a
deletion. Will return `null` if this position is at the end of
its parent node or its parent node isn't a textblock (in which
case no marks should be preserved).

#### Parameters

| Parameter | Type          | Description                             |
| --------- | ------------- | --------------------------------------- |
| `$end`    | `ResolvedPos` | The end position to compare marks with. |

#### Returns

readonly [`Mark`](../../Mark/classes/Mark.md)[]

An array of marks to preserve, or null if preservation doesn't apply.

---

### max()

```ts
max(other): ResolvedPos;
```

Defined in: [packages/model/src/elements/ResolvedPos.ts:510](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/elements/ResolvedPos.ts#L510)

Return the greater of this and the given position.

#### Parameters

| Parameter | Type          | Description                                  |
| --------- | ------------- | -------------------------------------------- |
| `other`   | `ResolvedPos` | The other resolved position to compare with. |

#### Returns

`ResolvedPos`

The resolved position with the greater absolute position value.

---

### min()

```ts
min(other): ResolvedPos;
```

Defined in: [packages/model/src/elements/ResolvedPos.ts:520](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/elements/ResolvedPos.ts#L520)

Return the smaller of this and the given position.

#### Parameters

| Parameter | Type          | Description                                  |
| --------- | ------------- | -------------------------------------------- |
| `other`   | `ResolvedPos` | The other resolved position to compare with. |

#### Returns

`ResolvedPos`

The resolved position with the smaller absolute position value.

---

### node()

```ts
node(depth?): Node;
```

Defined in: [packages/model/src/elements/ResolvedPos.ts:246](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/elements/ResolvedPos.ts#L246)

The ancestor node at the given level. `p.node(p.depth)` is the
same as `p.parent`.

#### Parameters

| Parameter | Type     | Description                                                                                                      |
| --------- | -------- | ---------------------------------------------------------------------------------------------------------------- |
| `depth?`  | `number` | The depth level. Defaults to `this.depth` if undefined. Negative values are interpreted as `this.depth + depth`. |

#### Returns

[`Node`](../../Node/classes/Node.md)

The node at the specified depth level.

---

### posAtIndex()

```ts
posAtIndex(index, depth?): number;
```

Defined in: [packages/model/src/elements/ResolvedPos.ts:355](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/elements/ResolvedPos.ts#L355)

Get the position at the given index in the parent node at the
given depth (which defaults to `this.depth`).

#### Parameters

| Parameter | Type     | Description                                                                                                      |
| --------- | -------- | ---------------------------------------------------------------------------------------------------------------- |
| `index`   | `number` | The child index to get the position for.                                                                         |
| `depth?`  | `number` | The depth level. Defaults to `this.depth` if undefined. Negative values are interpreted as `this.depth + depth`. |

#### Returns

`number`

The absolute position at the given child index.

#### Remarks

Complexity: Time: O(index) - needs to iterate through preceding children.

---

### sameParent()

```ts
sameParent(other): boolean;
```

Defined in: [packages/model/src/elements/ResolvedPos.ts:500](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/elements/ResolvedPos.ts#L500)

Query whether the given position shares the same parent node.

#### Parameters

| Parameter | Type          | Description                                  |
| --------- | ------------- | -------------------------------------------- |
| `other`   | `ResolvedPos` | The other resolved position to compare with. |

#### Returns

`boolean`

True if both positions share the same parent node, false otherwise.

---

### sharedDepth()

```ts
sharedDepth(pos): number;
```

Defined in: [packages/model/src/elements/ResolvedPos.ts:450](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/elements/ResolvedPos.ts#L450)

The depth up to which this position and the given (non-resolved)
position share the same parent nodes.

#### Parameters

| Parameter | Type     | Description                                           |
| --------- | -------- | ----------------------------------------------------- |
| `pos`     | `number` | The absolute position to compare with (non-resolved). |

#### Returns

`number`

The depth level where both positions share the same parent, or 0 if only the root is shared.

---

### start()

```ts
start(depth?): number;
```

Defined in: [packages/model/src/elements/ResolvedPos.ts:285](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/elements/ResolvedPos.ts#L285)

The (absolute) position at the start of the node at the given
level.

#### Parameters

| Parameter | Type     | Description                                                                                                      |
| --------- | -------- | ---------------------------------------------------------------------------------------------------------------- |
| `depth?`  | `number` | The depth level. Defaults to `this.depth` if undefined. Negative values are interpreted as `this.depth + depth`. |

#### Returns

`number`

The absolute position at the start of the node at the specified depth.

---

### toString()

```ts
toString(): string;
```

Defined in: [packages/model/src/elements/ResolvedPos.ts:532](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/elements/ResolvedPos.ts#L532)

Return a string representation of this position for debugging purposes.
Format: "nodetype_index/nodetype_index:offset"

#### Returns

`string`

A human-readable string describing this position's path through the document tree.

#### Example

```ts
Returns something like "doc_0/paragraph_1:5" for a position 5 chars into the second paragraph.
```

---

### resolve()

```ts
static resolve(doc, pos): ResolvedPos;
```

Defined in: [packages/model/src/elements/ResolvedPos.ts:178](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/elements/ResolvedPos.ts#L178)

Resolve a position in a document into a ResolvedPos object.
This method traverses the document tree from the root to find all ancestor nodes
and their positions leading to the given position.

#### Parameters

| Parameter | Type                                 | Description                                                               |
| --------- | ------------------------------------ | ------------------------------------------------------------------------- |
| `doc`     | [`Node`](../../Node/classes/Node.md) | The document node to resolve the position in.                             |
| `pos`     | `number`                             | The absolute position to resolve. Must be between 0 and doc.content.size. |

#### Returns

`ResolvedPos`

A new ResolvedPos instance containing the resolved position information.

#### Throws

If the position is out of range.

---

### resolveCached()

```ts
static resolveCached(doc, pos): ResolvedPos;
```

Defined in: [packages/model/src/elements/ResolvedPos.ts:217](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/elements/ResolvedPos.ts#L217)

Resolve a position with caching. This method maintains a per-document cache
of recently resolved positions using a circular buffer with Map-based O(1) lookups.
If the position is already cached, it returns the cached instance; otherwise,
it resolves the position and adds it to the cache.

#### Parameters

| Parameter | Type                                 | Description                                   |
| --------- | ------------------------------------ | --------------------------------------------- |
| `doc`     | [`Node`](../../Node/classes/Node.md) | The document node to resolve the position in. |
| `pos`     | `number`                             | The absolute position to resolve.             |

#### Returns

`ResolvedPos`

A ResolvedPos instance, either from cache or newly created.

#### Throws

If the position is out of range.
