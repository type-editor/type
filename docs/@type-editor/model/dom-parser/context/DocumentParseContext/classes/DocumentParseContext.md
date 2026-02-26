[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/model](../../../../README.md) / [dom-parser/context/DocumentParseContext](../README.md) / DocumentParseContext

# Class: DocumentParseContext

Defined in: [packages/model/src/dom-parser/context/DocumentParseContext.ts:46](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/dom-parser/context/DocumentParseContext.ts#L46)

Manages the state and operations for parsing DOM content into ProseMirror nodes.

## Remarks

ParseContext maintains a stack of NodeParseContext objects representing the hierarchy
of nodes being built during parsing. It handles DOM traversal, content matching,
mark application, and position tracking.

## Implements

- [`DOMParseContext`](../../../../types/dom-parser/DOMParseContext/interfaces/DOMParseContext.md)

## Constructors

### Constructor

```ts
new DocumentParseContext(
   parser,
   options,
   isOpen): DocumentParseContext;
```

Defined in: [packages/model/src/dom-parser/context/DocumentParseContext.ts:104](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/dom-parser/context/DocumentParseContext.ts#L104)

Creates a new parse context for converting DOM to ProseMirror nodes.

#### Parameters

| Parameter | Type                                                                                   | Description                                         |
| --------- | -------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `parser`  | [`DOMParser`](../../../DOMParser/classes/DOMParser.md)                                 | The DOM parser instance with schema and parse rules |
| `options` | [`ParseOptions`](../../../../types/dom-parser/ParseOptions/interfaces/ParseOptions.md) | Configuration options for the parsing operation     |
| `isOpen`  | `boolean`                                                                              | Whether the context should start in an open state   |

#### Returns

`DocumentParseContext`

#### Remarks

Initializes the node context stack with an appropriate top-level context
based on the provided options and whether parsing is open-ended.

## Accessors

### currentPos

#### Get Signature

```ts
get currentPos(): number;
```

Defined in: [packages/model/src/dom-parser/context/DocumentParseContext.ts:138](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/dom-parser/context/DocumentParseContext.ts#L138)

Calculates the current document position based on content added so far.

##### Remarks

This method:

1. Ensures all extra contexts are closed
2. Sums the size of all content in open contexts
3. Accounts for the opening positions of parent nodes

##### Returns

`number`

The position in the document being constructed

The current position in the document being constructed.

#### Remarks

This position is calculated based on the content added so far
and is used for tracking DOM position mappings.

#### Implementation of

[`DOMParseContext`](../../../../types/dom-parser/DOMParseContext/interfaces/DOMParseContext.md).[`currentPos`](../../../../types/dom-parser/DOMParseContext/interfaces/DOMParseContext.md#property-currentpos)

---

### top

#### Get Signature

```ts
get top(): NodeParseContext;
```

Defined in: [packages/model/src/dom-parser/context/DocumentParseContext.ts:123](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/dom-parser/context/DocumentParseContext.ts#L123)

Gets the currently active node context at the top of the stack.

##### Returns

[`NodeParseContext`](../../../../types/dom-parser/NodeParseContext/interfaces/NodeParseContext.md)

The node context being currently built

The currently active node context at the top of the context stack.

#### Remarks

This represents the node being currently built during parsing.

#### Implementation of

[`DOMParseContext`](../../../../types/dom-parser/DOMParseContext/interfaces/DOMParseContext.md).[`top`](../../../../types/dom-parser/DOMParseContext/interfaces/DOMParseContext.md#property-top)

## Methods

### addAll()

```ts
addAll(
   parent,
   marks,
   startIndex?,
   endIndex?): void;
```

Defined in: [packages/model/src/dom-parser/context/DocumentParseContext.ts:165](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/dom-parser/context/DocumentParseContext.ts#L165)

Parses and adds all child nodes from a DOM element to the current context.

#### Parameters

| Parameter     | Type                                                           | Description                                                                         |
| ------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `parent`      | `Node`                                                         | The DOM node whose children should be parsed                                        |
| `marks`       | readonly [`Mark`](../../../../elements/Mark/classes/Mark.md)[] | The marks to apply to the parsed content                                            |
| `startIndex?` | `number`                                                       | Optional starting index of child nodes to parse (inclusive, defaults to 0)          |
| `endIndex?`   | `number`                                                       | Optional ending index of child nodes to parse (exclusive, defaults to all children) |

#### Returns

`void`

#### Remarks

If startIndex and endIndex are not provided, all children are parsed.
The method handles position tracking and synchronization after each node.

#### Implementation of

[`DOMParseContext`](../../../../types/dom-parser/DOMParseContext/interfaces/DOMParseContext.md).[`addAll`](../../../../types/dom-parser/DOMParseContext/interfaces/DOMParseContext.md#addall)

---

### finish()

```ts
finish():
  | Fragment
  | Node;
```

Defined in: [packages/model/src/dom-parser/context/DocumentParseContext.ts:195](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/dom-parser/context/DocumentParseContext.ts#L195)

Completes the parsing process and returns the final result.

#### Returns

\| [`Fragment`](../../../../elements/Fragment/classes/Fragment.md)
\| [`Node`](../../../../elements/Node/classes/Node.md)

The parsed content as either a complete Node or a Fragment

#### Remarks

This method:

1. Resets the open level to the root context
2. Closes all open node contexts
3. Performs final validation and content filling according to schema requirements
4. Returns the completed top-level node or fragment

#### Implementation of

[`DOMParseContext`](../../../../types/dom-parser/DOMParseContext/interfaces/DOMParseContext.md).[`finish`](../../../../types/dom-parser/DOMParseContext/interfaces/DOMParseContext.md#finish)

---

### matchesContext()

```ts
matchesContext(context): boolean;
```

Defined in: [packages/model/src/dom-parser/context/DocumentParseContext.ts:220](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/dom-parser/context/DocumentParseContext.ts#L220)

Determines whether the given context string matches this context.

#### Parameters

| Parameter | Type     | Description                       |
| --------- | -------- | --------------------------------- |
| `context` | `string` | A context string to match against |

#### Returns

`boolean`

True if the context matches, false otherwise

#### Remarks

Context strings specify ancestor node requirements using slash-separated paths:

- "doc/blockquote/paragraph" matches a paragraph in a blockquote in a doc
- Empty path segments ("//") act as wildcards matching any depth
- Pipe characters ("|") separate alternative contexts (OR logic)
- Names can match node types or node groups

Examples:

- "paragraph" matches if we're directly in a paragraph
- "blockquote/" matches a blockquote with any content
- "doc//paragraph" matches a paragraph anywhere inside doc
- "list|blockquote" matches either list or blockquote contexts

#### Implementation of

[`DOMParseContext`](../../../../types/dom-parser/DOMParseContext/interfaces/DOMParseContext.md).[`matchesContext`](../../../../types/dom-parser/DOMParseContext/interfaces/DOMParseContext.md#matchescontext)
