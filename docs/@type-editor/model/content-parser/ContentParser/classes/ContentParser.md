[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/model](../../../README.md) / [content-parser/ContentParser](../README.md) / ContentParser

# Class: ContentParser

Defined in: [packages/model/src/content-parser/ContentParser.ts:23](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/model/src/content-parser/ContentParser.ts#L23)

Parser for ProseMirror content expressions.

Content expressions use a regular-expression-like syntax to describe
what content is allowed in a node. For example:

- "paragraph+" means one or more paragraphs
- "heading | paragraph" means a heading or paragraph
- "block\{2,4\}" means 2 to 4 block elements

The parser converts these expressions into a ContentMatch automaton
that can efficiently validate and match node sequences.

## Constructors

### Constructor

```ts
new ContentParser(): ContentParser;
```

#### Returns

`ContentParser`

## Methods

### parse()

```ts
parse(string, nodeTypes): ContentMatch;
```

Defined in: [packages/model/src/content-parser/ContentParser.ts:52](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/model/src/content-parser/ContentParser.ts#L52)

Parses a content expression string into a ContentMatch automaton.

#### Parameters

| Parameter   | Type                                                                                                   | Description                                          |
| ----------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| `string`    | `string`                                                                                               | The content expression to parse                      |
| `nodeTypes` | `Readonly`&lt;`Record`&lt;`string`, [`NodeType`](../../../schema/NodeType/classes/NodeType.md)&gt;&gt; | Map of available node type names to NodeType objects |

#### Returns

[`ContentMatch`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md)

A ContentMatch representing the valid content patterns

#### Throws

If the content expression is invalid

---

### parse()

```ts
static parse(string, nodeTypes): ContentMatch;
```

Defined in: [packages/model/src/content-parser/ContentParser.ts:39](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/model/src/content-parser/ContentParser.ts#L39)

Parses a content expression string into a ContentMatch automaton.

#### Parameters

| Parameter   | Type                                                                                                   | Description                                          |
| ----------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- | --------- |
| `string`    | `string`                                                                                               | The content expression to parse (e.g., "paragraph+   | heading") |
| `nodeTypes` | `Readonly`&lt;`Record`&lt;`string`, [`NodeType`](../../../schema/NodeType/classes/NodeType.md)&gt;&gt; | Map of available node type names to NodeType objects |

#### Returns

[`ContentMatch`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md)

A ContentMatch representing the valid content patterns

#### Throws

If the content expression is invalid
