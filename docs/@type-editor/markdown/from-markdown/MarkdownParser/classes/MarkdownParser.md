[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/markdown](../../../README.md) / [from-markdown/MarkdownParser](../README.md) / MarkdownParser

# Class: MarkdownParser

Defined in: [from-markdown/MarkdownParser.ts:16](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/markdown/src/from-markdown/MarkdownParser.ts#L16)

A configuration of a Markdown parser. Such a parser uses
[markdown-it](https://github.com/markdown-it/markdown-it) to
tokenize a file, and then runs the custom rules it is given over
the tokens to create a ProseMirror document tree.

## Constructors

### Constructor

```ts
new MarkdownParser(
   schema,
   tokenizer,
   tokens): MarkdownParser;
```

Defined in: [from-markdown/MarkdownParser.ts:36](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/markdown/src/from-markdown/MarkdownParser.ts#L36)

Create a parser with the given configuration. You can configure
the markdown-it parser to parse the dialect you want, and provide
a description of the ProseMirror entities those tokens map to in
the `tokens` object, which maps token names to descriptions of
what to do with them. Such a description is an object, and may
have the following properties:

#### Parameters

| Parameter   | Type                                                                                      | Description                                                                                                                |
| ----------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `schema`    | `Schema`                                                                                  | The parser's document schema.                                                                                              |
| `tokenizer` | `MarkdownIt`                                                                              | This parser's markdown-it tokenizer.                                                                                       |
| `tokens`    | `Record`&lt;`string`, [`ParseSpec`](../../../types/ParseSpec/interfaces/ParseSpec.md)&gt; | The value of the `tokens` object used to construct this parser. Can be useful to copy and modify to base other parsers on. |

#### Returns

`MarkdownParser`

## Properties

| Property                                    | Modifier   | Type                                                                                      | Defined in                                                                                                                                                                        |
| ------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-schema"></a> `schema`       | `readonly` | `Schema`                                                                                  | [from-markdown/MarkdownParser.ts:18](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/markdown/src/from-markdown/MarkdownParser.ts#L18) |
| <a id="property-tokenizer"></a> `tokenizer` | `readonly` | `MarkdownIt`                                                                              | [from-markdown/MarkdownParser.ts:19](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/markdown/src/from-markdown/MarkdownParser.ts#L19) |
| <a id="property-tokens"></a> `tokens`       | `readonly` | `Record`&lt;`string`, [`ParseSpec`](../../../types/ParseSpec/interfaces/ParseSpec.md)&gt; | [from-markdown/MarkdownParser.ts:20](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/markdown/src/from-markdown/MarkdownParser.ts#L20) |

## Methods

### parse()

```ts
parse(text, markdownEnv?): Node_2;
```

Defined in: [from-markdown/MarkdownParser.ts:59](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/markdown/src/from-markdown/MarkdownParser.ts#L59)

Parse a string as [CommonMark](http://commonmark.org/) markup,
and create a ProseMirror document as prescribed by this parser's
rules.

The second argument, when given, is passed through to the
[Markdown
parser](https://markdown-it.github.io/markdown-it/#MarkdownIt.parse).

#### Parameters

| Parameter     | Type     | Description                                                   |
| ------------- | -------- | ------------------------------------------------------------- |
| `text`        | `string` | The markdown text to parse.                                   |
| `markdownEnv` | `object` | Optional environment object passed to the markdown-it parser. |

#### Returns

`Node_2`

The parsed ProseMirror document node.
