[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/model](../../../README.md) / [content-parser/DocumentContentMatch](../README.md) / DocumentContentMatch

# Class: DocumentContentMatch

Defined in: [packages/model/src/content-parser/DocumentContentMatch.ts:88](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/content-parser/DocumentContentMatch.ts#L88)

Instances of this class represent a match state of a node type's
[content expression](#model.NodeSpec.content), and can be used to
find out whether further content matches here, and whether a given
position is a valid end of the node.

The content match system uses a finite automaton approach where each
ContentMatch instance represents a state, and edges represent possible
node types that can be matched at that state.

## Finite Automaton Model

Content expressions (like "paragraph+" or "heading | paragraph\*") are compiled
into a finite automaton where:

- Each state (ContentMatch) represents a position in parsing the expression
- Edges represent valid node types that can appear at that position
- Valid end states indicate where content can legally terminate

## Common Operations

- **Matching**: Check if a node type or fragment can appear at this position
- **Filling**: Find what nodes to insert to make invalid content valid
- **Wrapping**: Find how to wrap a node to make it fit at this position
- **Validation**: Check if content satisfies the content expression

## Example

```typescript
// Check if a paragraph can appear at this position
const nextMatch = contentMatch.matchType(schema.nodes.paragraph);
if (nextMatch) {
  console.log("Paragraph is valid here");
}

// Fill before a fragment to make it valid
const toInsert = contentMatch.fillBefore(fragment);
if (toInsert) {
  // Insert these nodes before the fragment
}

// Find wrapping for a node
const wrapping = contentMatch.findWrapping(schema.nodes.list_item);
if (wrapping) {
  // Wrap the node in these node types (outermost first)
}
```

## Implements

- [`ContentMatch`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md)

## Constructors

### Constructor

```ts
new DocumentContentMatch(validEnd): DocumentContentMatch;
```

Defined in: [packages/model/src/content-parser/DocumentContentMatch.ts:134](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/content-parser/DocumentContentMatch.ts#L134)

Creates a new content match state.

ContentMatch instances are typically created during schema compilation when
content expressions are parsed into finite automaton states. Direct construction
is rarely needed in user code.

#### Parameters

| Parameter  | Type      | Description                                                                                                          |
| ---------- | --------- | -------------------------------------------------------------------------------------------------------------------- |
| `validEnd` | `boolean` | Whether this match state represents a valid end of the node. True means content can legally terminate at this state. |

#### Returns

`DocumentContentMatch`

#### Example

```typescript
// A valid end state (content can stop here)
const endState = new ContentMatch(true);

// An intermediate state (more content required)
const intermediateState = new ContentMatch(false);
```

## Accessors

### defaultType

#### Get Signature

```ts
get defaultType(): NodeType;
```

Defined in: [packages/model/src/content-parser/DocumentContentMatch.ts:227](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/content-parser/DocumentContentMatch.ts#L227)

Get the first matching node type at this match position that can
be generated without additional attributes or content.

This is useful for automatically filling content. It returns the first
node type that:

- Is not a text node (text requires actual text content)
- Doesn't have required attributes (would need attribute values)

Returns null if no such "fillable" type exists at this position.

##### Example

```typescript
const defaultType = contentMatch.defaultType;
if (defaultType) {
  // Can auto-fill with this type
  const node = defaultType.createAndFill();
}
```

##### Returns

[`NodeType`](../../../schema/NodeType/classes/NodeType.md)

The first auto-fillable node type, or null if none exists.

#### Implementation of

[`ContentMatch`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md).[`defaultType`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md#property-defaulttype)

---

### edgeCount

#### Get Signature

```ts
get edgeCount(): number;
```

Defined in: [packages/model/src/content-parser/DocumentContentMatch.ts:256](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/content-parser/DocumentContentMatch.ts#L256)

The number of outgoing edges this node has in the finite
automaton that describes the content expression.

This indicates how many different node types can validly appear
at this position. An edgeCount of 0 means no content can follow
(though this might still be a valid end state).

##### Example

```typescript
console.log(`${contentMatch.edgeCount} possible node types here`);

if (contentMatch.edgeCount === 0 && !contentMatch.validEnd) {
  console.log("Invalid state - no content allowed but not an end");
}
```

##### Returns

`number`

The number of possible next node types.

#### Implementation of

[`ContentMatch`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md).[`edgeCount`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md#property-edgecount)

---

### inlineContent

#### Get Signature

```ts
get inlineContent(): boolean;
```

Defined in: [packages/model/src/content-parser/DocumentContentMatch.ts:201](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/content-parser/DocumentContentMatch.ts#L201)

Returns true if this match state represents inline content.
Content is considered inline if there are possible next matches
and the first one is an inline node type.

This is used to distinguish between block-level and inline content contexts.
For example, a paragraph's content match would have inlineContent = true,
while a document's content match would have inlineContent = false.

##### Example

```typescript
if (contentMatch.inlineContent) {
  console.log("Expecting inline content like text or marks");
} else {
  console.log("Expecting block-level content like paragraphs");
}
```

##### Returns

`boolean`

True if the next possible content is inline, false otherwise.

#### Implementation of

[`ContentMatch`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md).[`inlineContent`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md#property-inlinecontent)

---

### next

#### Get Signature

```ts
get next(): MatchEdge[];
```

Defined in: [packages/model/src/content-parser/DocumentContentMatch.ts:154](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/content-parser/DocumentContentMatch.ts#L154)

Get the array of possible next match edges from this state.

Each edge represents a valid node type that can appear at this position,
along with the state to transition to after matching that type.

##### Example

```typescript
// Explore all possible next node types
for (const edge of contentMatch.next) {
  console.log(`Can accept: ${edge.type.name}`);
}
```

##### Returns

[`MatchEdge`](../../../types/content-parser/ContentMatch/interfaces/MatchEdge.md)[]

An array of match edges representing all valid transitions from this state.

#### Implementation of

[`ContentMatch`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md).[`next`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md#property-next)

---

### validEnd

#### Get Signature

```ts
get validEnd(): boolean;
```

Defined in: [packages/model/src/content-parser/DocumentContentMatch.ts:177](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/content-parser/DocumentContentMatch.ts#L177)

Returns true when this match state represents a valid end of the node.

When true, content can legally terminate at this state according to the
content expression. For example, in "paragraph+", after matching at least
one paragraph, subsequent states are valid ends. In "paragraph\*", even
the initial state is a valid end (zero or more paragraphs).

##### Example

```typescript
if (contentMatch.validEnd) {
  console.log("Content can legally end here");
} else {
  console.log("More content required");
}
```

##### Returns

`boolean`

True if content can terminate at this state, false otherwise.

#### Implementation of

[`ContentMatch`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md).[`validEnd`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md#property-validend)

## Methods

### compatible()

```ts
compatible(other): boolean;
```

Defined in: [packages/model/src/content-parser/DocumentContentMatch.ts:358](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/content-parser/DocumentContentMatch.ts#L358)

Check whether this match state is compatible with another match state.
Two match states are compatible if they have at least one node type in common
among their possible next matches.

This is useful when trying to join or merge content from different contexts.
If two positions have compatible content matches, they can potentially accept
the same type of content.

#### Parameters

| Parameter | Type                                                                                    | Description                                                |
| --------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `other`   | [`ContentMatch`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md) | The other content match state to check compatibility with. |

#### Returns

`boolean`

True if the match states share at least one common node type in their
next possible matches, false if they have no node types in common.

#### Example

```typescript
const match1 = schema.nodes.doc.contentMatch;
const match2 = schema.nodes.blockquote.contentMatch;

if (match1.compatible(match2)) {
  console.log("Both can accept some common node type");
  // e.g., both might accept paragraphs
}
```

#### Implementation of

[`ContentMatch`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md).[`compatible`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md#compatible)

---

### edge()

```ts
edge(number): MatchEdge;
```

Defined in: [packages/model/src/content-parser/DocumentContentMatch.ts:519](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/content-parser/DocumentContentMatch.ts#L519)

Get the _n_'th outgoing edge from this node in the finite
automaton that describes the content expression.

This provides indexed access to the edges, which can be useful when
iterating through possible transitions numerically rather than using
the `next` array directly.

#### Parameters

| Parameter | Type     | Description                                                                           |
| --------- | -------- | ------------------------------------------------------------------------------------- |
| `number`  | `number` | The index of the edge to retrieve (0-based). Must be within the range [0, edgeCount). |

#### Returns

[`MatchEdge`](../../../types/content-parser/ContentMatch/interfaces/MatchEdge.md)

The match edge at the specified index, containing the node type
and next state.

#### Throws

If the index is out of bounds (negative or \>= edgeCount).

#### Example

```typescript
for (let i = 0; i < contentMatch.edgeCount; i++) {
  const edge = contentMatch.edge(i);
  console.log(`Edge ${i}: ${edge.type.name}`);
}
```

#### Implementation of

[`ContentMatch`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md).[`edge`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md#edge)

---

### fillBefore()

```ts
fillBefore(
   after,
   toEnd?,
   startIndex?): Fragment;
```

Defined in: [packages/model/src/content-parser/DocumentContentMatch.ts:414](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/content-parser/DocumentContentMatch.ts#L414)

Try to match the given fragment, and if that fails, see if it can
be made to match by inserting nodes in front of it. When
successful, return a fragment of inserted nodes (which may be
empty if nothing had to be inserted). When `toEnd` is true, only
return a fragment if the resulting match goes to the end of the
content expression.

This method performs a depth-first search through possible node insertions
to find a valid sequence that would allow the given fragment to match.
It automatically creates and fills nodes using their default content.

The search avoids cycles by tracking visited states and only considers
node types that don't require attributes or content (non-text, no required attrs).

#### Parameters

| Parameter    | Type                                                         | Default value | Description                                                                                                                                                                                    |
| ------------ | ------------------------------------------------------------ | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `after`      | [`Fragment`](../../../elements/Fragment/classes/Fragment.md) | `undefined`   | The fragment that should match after inserting nodes. The method tries to find nodes to insert before this fragment to make the entire sequence valid.                                         |
| `toEnd`      | `boolean`                                                    | `false`       | Whether the match must reach a valid end state. When true, only returns a result if content can legally end after the fragment. Default is false, allowing intermediate (non-terminal) states. |
| `startIndex` | `number`                                                     | `0`           | The index in the fragment to start matching from. Allows matching a suffix of the fragment. Default is 0.                                                                                      |

#### Returns

[`Fragment`](../../../elements/Fragment/classes/Fragment.md)

A fragment of nodes to insert before `after`, which may be empty if
`after` already matches without insertions, or null if no valid
insertion sequence exists.

#### Example

```typescript
// Try to make a fragment valid by inserting nodes before it
const fragment = Fragment.from([textNode]);
const toInsert = contentMatch.fillBefore(fragment);

if (toInsert) {
  // Combine: toInsert + fragment
  const validContent = toInsert.append(fragment);
}

// Require reaching a valid end
const toEnd = contentMatch.fillBefore(fragment, true);
if (toEnd && contentMatch.matchFragment(toEnd.append(fragment))?.validEnd) {
  console.log("Content is now complete");
}
```

#### Implementation of

[`ContentMatch`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md).[`fillBefore`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md#fillbefore)

---

### findWrapping()

```ts
findWrapping(target): readonly NodeType[];
```

Defined in: [packages/model/src/content-parser/DocumentContentMatch.ts:485](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/content-parser/DocumentContentMatch.ts#L485)

Find a set of wrapping node types that would allow a node of the
given type to appear at this position. The result may be empty
(when it fits directly) and will be null when no such wrapping
exists.

This method uses breadth-first search to find the shortest wrapping sequence.
For example, if a list_item can't appear directly in a doc, this might return
[bullet_list] to indicate the list_item should be wrapped in a bullet_list.

The result is cached to avoid recomputing wrappings for the same target type,
providing O(1) lookups after the first computation.

#### Parameters

| Parameter | Type                                                       | Description                                                                                                    |
| --------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `target`  | [`NodeType`](../../../schema/NodeType/classes/NodeType.md) | The node type to find wrapping for. This is the innermost node type that needs to fit at the current position. |

#### Returns

readonly [`NodeType`](../../../schema/NodeType/classes/NodeType.md)[]

An array of node types to wrap with (from outermost to innermost),
an empty array if the target fits directly without wrapping,
or null if no valid wrapping exists.

#### Example

```typescript
// Find how to wrap a list_item to fit in a doc
const wrapping = docContentMatch.findWrapping(schema.nodes.list_item);
if (wrapping) {
  // wrapping might be [bullet_list]
  // So we'd wrap: bullet_list(list_item(...))
  console.log(
    "Wrap in:",
    wrapping.map((t) => t.name),
  );
}

// Empty array means no wrapping needed
const direct = match.findWrapping(schema.nodes.paragraph);
if (direct && direct.length === 0) {
  console.log("Paragraph fits directly");
}
```

#### Implementation of

[`ContentMatch`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md).[`findWrapping`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md#findwrapping)

---

### matchFragment()

```ts
matchFragment(
   fragment,
   start?,
   end?): ContentMatch;
```

Defined in: [packages/model/src/content-parser/DocumentContentMatch.ts:328](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/content-parser/DocumentContentMatch.ts#L328)

Try to match a fragment. Returns the resulting match state when successful.

Iterates through the child nodes in the fragment and attempts to match each one
sequentially using matchType(). If any match fails, returns null immediately.
This is essentially a fold operation over the fragment using matchType.

#### Parameters

| Parameter  | Type                                                         | Default value         | Description                                                                                               |
| ---------- | ------------------------------------------------------------ | --------------------- | --------------------------------------------------------------------------------------------------------- |
| `fragment` | [`Fragment`](../../../elements/Fragment/classes/Fragment.md) | `undefined`           | The fragment containing nodes to match. Each child node's type is matched sequentially from start to end. |
| `start`    | `number`                                                     | `0`                   | The starting index in the fragment (inclusive). Defaults to 0.                                            |
| `end`      | `number`                                                     | `fragment.childCount` | The ending index in the fragment (exclusive). Defaults to the total number of children in the fragment.   |

#### Returns

[`ContentMatch`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md)

The resulting content match state after matching all nodes in the range,
or null if matching fails for any node in the sequence.

#### Example

```typescript
const fragment = Fragment.from([para1, para2, para3]);

// Match the entire fragment
const result = contentMatch.matchFragment(fragment);
if (result) {
  console.log("Fragment is valid");
  if (result.validEnd) {
    console.log("And can end here");
  }
}

// Match a sub-range
const partial = contentMatch.matchFragment(fragment, 1, 2);
// Only matches para2
```

#### Implementation of

[`ContentMatch`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md).[`matchFragment`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md#matchfragment)

---

### matchType()

```ts
matchType(type): ContentMatch;
```

Defined in: [packages/model/src/content-parser/DocumentContentMatch.ts:286](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/content-parser/DocumentContentMatch.ts#L286)

Match a node type, returning the next match state after that node if successful.

This is the fundamental operation in the content matching automaton. It checks
if the given node type is valid at the current position (i.e., if there's an
outgoing edge for this type) and returns the next state if so.

#### Parameters

| Parameter | Type                                                       | Description                                                                                |
| --------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `type`    | [`NodeType`](../../../schema/NodeType/classes/NodeType.md) | The node type to match. This is checked against all outgoing edges from the current state. |

#### Returns

[`ContentMatch`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md)

The next content match state if the type is valid at this position,
or null if the node type is not allowed here.

#### Example

```typescript
const match = nodeType.contentMatch;

// Check if paragraph is valid
const afterPara = match.matchType(schema.nodes.paragraph);
if (afterPara) {
  console.log("Paragraph accepted");

  // Can we add another paragraph?
  const afterTwo = afterPara.matchType(schema.nodes.paragraph);
}
```

#### Implementation of

[`ContentMatch`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md).[`matchType`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md#matchtype)

---

### toString()

```ts
toString(): string;
```

Defined in: [packages/model/src/content-parser/DocumentContentMatch.ts:552](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/content-parser/DocumentContentMatch.ts#L552)

Generate a string representation of this content match and all reachable states.
Useful for debugging and visualizing the finite automaton structure.

The output format shows each state on a line with:

- State index (numbered from 0)
- '\*' marker if the state is a valid end
- List of transitions: "type-\>targetState" pairs

This performs a depth-first scan to discover all reachable states.

#### Returns

`string`

A multi-line string showing all states and their transitions.

#### Example

```typescript
console.log(contentMatch.toString());
// Output might be:
// 0  paragraph->1, heading->1
// 1* paragraph->1
//
// State 0 can accept paragraph or heading, both go to state 1
// State 1 is a valid end (*) and can accept more paragraphs
```

#### Implementation of

[`ContentMatch`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md).[`toString`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md#tostring)
