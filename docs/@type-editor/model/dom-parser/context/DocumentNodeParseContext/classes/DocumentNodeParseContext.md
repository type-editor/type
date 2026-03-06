[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/model](../../../../README.md) / [dom-parser/context/DocumentNodeParseContext](../README.md) / DocumentNodeParseContext

# Class: DocumentNodeParseContext

Defined in: [packages/model/src/dom-parser/context/DocumentNodeParseContext.ts:22](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/dom-parser/context/DocumentNodeParseContext.ts#L22)

Represents a node being built during parsing.

## Remarks

NodeContext maintains the state for a single node in the parsing context stack,
including its type, attributes, content, marks, and content matching state.

## Implements

- [`NodeParseContext`](../../../../types/dom-parser/NodeParseContext/interfaces/NodeParseContext.md)

## Constructors

### Constructor

```ts
new DocumentNodeParseContext(
   type,
   attrs,
   marks,
   solid,
   match,
   options): DocumentNodeParseContext;
```

Defined in: [packages/model/src/dom-parser/context/DocumentNodeParseContext.ts:59](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/dom-parser/context/DocumentNodeParseContext.ts#L59)

Creates a new node context for managing node construction during parsing.

#### Parameters

| Parameter | Type                                                                                       | Description                                                                                      |
| --------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `type`    | [`NodeType`](../../../../schema/NodeType/classes/NodeType.md)                              | The type of node being built, or null for fragments                                              |
| `attrs`   | `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt;                                          | The attributes for the node, or null if none                                                     |
| `marks`   | readonly [`Mark`](../../../../elements/Mark/classes/Mark.md)[]                             | The marks to apply to the node's content                                                         |
| `solid`   | `boolean`                                                                                  | Whether this context is "solid" (shouldn't be left when searching for a place to insert content) |
| `match`   | [`ContentMatch`](../../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md) | The current content match state, or null to use the type's default                               |
| `options` | `number`                                                                                   | Bitfield of parsing options (OPT_PRESERVE_WS, OPT_PRESERVE_WS_FULL, OPT_OPEN_LEFT)               |

#### Returns

`DocumentNodeParseContext`

## Accessors

### content

#### Get Signature

```ts
get content(): Node[];
```

Defined in: [packages/model/src/dom-parser/context/DocumentNodeParseContext.ts:94](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/dom-parser/context/DocumentNodeParseContext.ts#L94)

Gets the array of child nodes that have been added to this context.

##### Returns

[`Node`](../../../../elements/Node/classes/Node.md)[]

#### Implementation of

[`NodeParseContext`](../../../../types/dom-parser/NodeParseContext/interfaces/NodeParseContext.md).[`content`](../../../../types/dom-parser/NodeParseContext/interfaces/NodeParseContext.md#property-content)

---

### match

#### Get Signature

```ts
get match(): ContentMatch;
```

Defined in: [packages/model/src/dom-parser/context/DocumentNodeParseContext.ts:78](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/dom-parser/context/DocumentNodeParseContext.ts#L78)

Gets the current content match state for validating additional content.

##### Returns

[`ContentMatch`](../../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md)

#### Set Signature

```ts
set match(match): void;
```

Defined in: [packages/model/src/dom-parser/context/DocumentNodeParseContext.ts:87](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/dom-parser/context/DocumentNodeParseContext.ts#L87)

Sets the content match state.

##### Parameters

| Parameter | Type                                                                                       | Description                                   |
| --------- | ------------------------------------------------------------------------------------------ | --------------------------------------------- |
| `match`   | [`ContentMatch`](../../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md) | The new content match state, or null to reset |

##### Returns

`void`

#### Implementation of

[`NodeParseContext`](../../../../types/dom-parser/NodeParseContext/interfaces/NodeParseContext.md).[`match`](../../../../types/dom-parser/NodeParseContext/interfaces/NodeParseContext.md#property-match)

---

### options

#### Get Signature

```ts
get options(): number;
```

Defined in: [packages/model/src/dom-parser/context/DocumentNodeParseContext.ts:115](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/dom-parser/context/DocumentNodeParseContext.ts#L115)

Gets the parsing options bitfield for this context.

##### Returns

`number`

#### Set Signature

```ts
set options(options): void;
```

Defined in: [packages/model/src/dom-parser/context/DocumentNodeParseContext.ts:124](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/dom-parser/context/DocumentNodeParseContext.ts#L124)

Sets the parsing options bitfield.

##### Parameters

| Parameter | Type     | Description              |
| --------- | -------- | ------------------------ |
| `options` | `number` | The new options bitfield |

##### Returns

`void`

#### Implementation of

[`NodeParseContext`](../../../../types/dom-parser/NodeParseContext/interfaces/NodeParseContext.md).[`options`](../../../../types/dom-parser/NodeParseContext/interfaces/NodeParseContext.md#property-options)

---

### solid

#### Get Signature

```ts
get solid(): boolean;
```

Defined in: [packages/model/src/dom-parser/context/DocumentNodeParseContext.ts:108](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/dom-parser/context/DocumentNodeParseContext.ts#L108)

Gets whether this context is solid (shouldn't be exited when finding a place for content).

##### Returns

`boolean`

#### Implementation of

[`NodeParseContext`](../../../../types/dom-parser/NodeParseContext/interfaces/NodeParseContext.md).[`solid`](../../../../types/dom-parser/NodeParseContext/interfaces/NodeParseContext.md#property-solid)

---

### type

#### Get Signature

```ts
get type(): NodeType;
```

Defined in: [packages/model/src/dom-parser/context/DocumentNodeParseContext.ts:101](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/dom-parser/context/DocumentNodeParseContext.ts#L101)

Gets the type of node being built, or null if building a fragment.

##### Returns

[`NodeType`](../../../../schema/NodeType/classes/NodeType.md)

#### Implementation of

[`NodeParseContext`](../../../../types/dom-parser/NodeParseContext/interfaces/NodeParseContext.md).[`type`](../../../../types/dom-parser/NodeParseContext/interfaces/NodeParseContext.md#property-type)

## Methods

### findWrapping()

```ts
findWrapping(node): readonly NodeType[];
```

Defined in: [packages/model/src/dom-parser/context/DocumentNodeParseContext.ts:140](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/dom-parser/context/DocumentNodeParseContext.ts#L140)

Finds a sequence of wrapper node types needed to make the given node fit in this context.

#### Parameters

| Parameter | Type                                                | Description                   |
| --------- | --------------------------------------------------- | ----------------------------- |
| `node`    | [`Node`](../../../../elements/Node/classes/Node.md) | The node to find wrapping for |

#### Returns

readonly [`NodeType`](../../../../schema/NodeType/classes/NodeType.md)[]

An array of node types to wrap with, an empty array if no wrapping needed, or null if impossible

#### Remarks

This method attempts to:

1. Fill any required content before the node
2. Find wrapper nodes that make the node valid according to content match rules
3. Update the match state if successful

#### Implementation of

[`NodeParseContext`](../../../../types/dom-parser/NodeParseContext/interfaces/NodeParseContext.md).[`findWrapping`](../../../../types/dom-parser/NodeParseContext/interfaces/NodeParseContext.md#findwrapping)

---

### finish()

```ts
finish(openEnd):
  | Fragment
  | Node;
```

Defined in: [packages/model/src/dom-parser/context/DocumentNodeParseContext.ts:174](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/dom-parser/context/DocumentNodeParseContext.ts#L174)

Finishes building this node context and returns the resulting node or fragment.

#### Parameters

| Parameter | Type      | Description                                                            |
| --------- | --------- | ---------------------------------------------------------------------- |
| `openEnd` | `boolean` | Whether to leave the node open (not filling required trailing content) |

#### Returns

\| [`Fragment`](../../../../elements/Fragment/classes/Fragment.md)
\| [`Node`](../../../../elements/Node/classes/Node.md)

The completed node (if this context has a type) or fragment (if null type)

#### Remarks

This method:

1. Strips trailing whitespace if whitespace preservation is not enabled
2. Fills any required trailing content if not leaving the node open
3. Creates the final node with the accumulated content and marks

#### Implementation of

[`NodeParseContext`](../../../../types/dom-parser/NodeParseContext/interfaces/NodeParseContext.md).[`finish`](../../../../types/dom-parser/NodeParseContext/interfaces/NodeParseContext.md#finish)

---

### inlineContext()

```ts
inlineContext(node): boolean;
```

Defined in: [packages/model/src/dom-parser/context/DocumentNodeParseContext.ts:198](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/dom-parser/context/DocumentNodeParseContext.ts#L198)

Determines whether this context represents inline content.

#### Parameters

| Parameter | Type   | Description                   |
| --------- | ------ | ----------------------------- |
| `node`    | `Node` | The DOM node being considered |

#### Returns

`boolean`

True if the context is inline, false if it's block-level

#### Remarks

The determination is made by checking:

1. If the node type is defined, use its inlineContent property
2. If content exists, check if the first content node is inline
3. Otherwise, check if the DOM parent is not a block-level element

#### Implementation of

[`NodeParseContext`](../../../../types/dom-parser/NodeParseContext/interfaces/NodeParseContext.md).[`inlineContext`](../../../../types/dom-parser/NodeParseContext/interfaces/NodeParseContext.md#inlinecontext)
