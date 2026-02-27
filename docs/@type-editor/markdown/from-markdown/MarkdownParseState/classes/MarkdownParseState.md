[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/markdown](../../../README.md) / [from-markdown/MarkdownParseState](../README.md) / MarkdownParseState

# Class: MarkdownParseState

Defined in: [from-markdown/MarkdownParseState.ts:13](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/markdown/src/from-markdown/MarkdownParseState.ts#L13)

Manages the state during markdown parsing, maintaining a stack of nodes being constructed
and tracking active marks. This class handles the incremental building of a ProseMirror
document tree from markdown-it tokens.

## Constructors

### Constructor

```ts
new MarkdownParseState(schema, tokenHandlers): MarkdownParseState;
```

Defined in: [from-markdown/MarkdownParseState.ts:25](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/markdown/src/from-markdown/MarkdownParseState.ts#L25)

Creates a new markdown parse state.

#### Parameters

| Parameter       | Type                                                                                                 | Description                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `schema`        | `Schema`                                                                                             | The ProseMirror schema to use for creating nodes and marks.          |
| `tokenHandlers` | `Record`&lt;`string`, [`TokenHandler`](../../../types/TokenHandler/type-aliases/TokenHandler.md)&gt; | A map of token types to handler functions that process those tokens. |

#### Returns

`MarkdownParseState`

## Accessors

### stack

#### Get Signature

```ts
get stack(): StackElement[];
```

Defined in: [from-markdown/MarkdownParseState.ts:39](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/markdown/src/from-markdown/MarkdownParseState.ts#L39)

Gets the current parsing stack.

##### Returns

[`StackElement`](../../../types/StackElement/interfaces/StackElement.md)[]

The array of stack elements representing the current parsing context.

## Methods

### addNode()

```ts
addNode(
   type,
   attrs,
   content?): Node_2;
```

Defined in: [from-markdown/MarkdownParseState.ts:125](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/markdown/src/from-markdown/MarkdownParseState.ts#L125)

Adds a node at the current position in the document tree.

#### Parameters

| Parameter  | Type                                              | Description                        |
| ---------- | ------------------------------------------------- | ---------------------------------- |
| `type`     | `NodeType`                                        | The type of node to create.        |
| `attrs`    | `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt; | The attributes for the node.       |
| `content?` | readonly `Node_2`[]                               | Optional child nodes for the node. |

#### Returns

`Node_2`

The created node, or null if creation failed.

---

### addText()

```ts
addText(text): void;
```

Defined in: [from-markdown/MarkdownParseState.ts:50](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/markdown/src/from-markdown/MarkdownParseState.ts#L50)

Adds the given text to the current position in the document,
using the current marks as styling. Attempts to merge with the
previous text node if they share the same marks.

#### Parameters

| Parameter | Type     | Description                                                     |
| --------- | -------- | --------------------------------------------------------------- |
| `text`    | `string` | The text content to add. If empty or falsy, no action is taken. |

#### Returns

`void`

---

### closeMark()

```ts
closeMark(mark): void;
```

Defined in: [from-markdown/MarkdownParseState.ts:91](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/markdown/src/from-markdown/MarkdownParseState.ts#L91)

Removes the given mark from the set of active marks.

#### Parameters

| Parameter | Type       | Description                                  |
| --------- | ---------- | -------------------------------------------- |
| `mark`    | `MarkType` | The mark type to remove from the active set. |

#### Returns

`void`

---

### closeNode()

```ts
closeNode(): Node_2;
```

Defined in: [from-markdown/MarkdownParseState.ts:160](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/markdown/src/from-markdown/MarkdownParseState.ts#L160)

Closes the node currently on top of the stack and adds it to its parent.

#### Returns

`Node_2`

The closed node.

---

### openMark()

```ts
openMark(mark): void;
```

Defined in: [from-markdown/MarkdownParseState.ts:81](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/markdown/src/from-markdown/MarkdownParseState.ts#L81)

Adds the given mark to the set of active marks.
Active marks are applied to all text nodes added until the mark is closed.

#### Parameters

| Parameter | Type   | Description                                 |
| --------- | ------ | ------------------------------------------- |
| `mark`    | `Mark` | The mark instance to add to the active set. |

#### Returns

`void`

---

### openNode()

```ts
openNode(type, attrs): void;
```

Defined in: [from-markdown/MarkdownParseState.ts:146](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/markdown/src/from-markdown/MarkdownParseState.ts#L146)

Opens a new node context on the stack. Subsequent content will be added
as children to this node until closeNode is called.

#### Parameters

| Parameter | Type                                              | Description                  |
| --------- | ------------------------------------------------- | ---------------------------- |
| `type`    | `NodeType`                                        | The type of node to open.    |
| `attrs`   | `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt; | The attributes for the node. |

#### Returns

`void`

---

### parseTokens()

```ts
parseTokens(tokens): void;
```

Defined in: [from-markdown/MarkdownParseState.ts:102](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/markdown/src/from-markdown/MarkdownParseState.ts#L102)

Parses an array of markdown-it tokens and processes them using registered handlers.

#### Parameters

| Parameter | Type      | Description                   |
| --------- | --------- | ----------------------------- |
| `tokens`  | `Token`[] | The array of tokens to parse. |

#### Returns

`void`

#### Throws

If a token type has no registered handler.
