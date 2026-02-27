[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/model](../../../README.md) / [dom-parser/DOMParser](../README.md) / DOMParser

# Class: DOMParser

Defined in: [packages/model/src/dom-parser/DOMParser.ts:39](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/dom-parser/DOMParser.ts#L39)

A DOM parser represents a strategy for parsing DOM content into a
ProseMirror document conforming to a given schema. Its behavior is
defined by an array of [rules](#model.ParseRule).

The parser processes DOM nodes and converts them into ProseMirror document nodes
based on the configured parse rules. It supports both tag-based rules (matching
DOM elements by selector) and style-based rules (matching CSS properties).

## Example

```typescript
// Create a parser from a schema
const parser = DOMParser.fromSchema(mySchema);

// Parse a DOM element
const doc = parser.parse(domElement);

// Parse a slice (for partial content)
const slice = parser.parseSlice(domElement);
```

## Constructors

### Constructor

```ts
new DOMParser(schema, rules): DOMParser;
```

Defined in: [packages/model/src/dom-parser/DOMParser.ts:117](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/dom-parser/DOMParser.ts#L117)

Create a parser that targets the given schema, using the given
parsing rules.

The constructor categorizes rules into tag and style rules, builds index maps
for efficient rule lookup during parsing, and determines whether list normalization
is needed based on the schema's content model.

#### Parameters

| Parameter | Type                                                                                    | Description                                                                                                                                                                                                                                                                         |
| --------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schema`  | [`Schema`](../../../schema/Schema/classes/Schema.md)                                    | The schema into which the parser parses. Defines the document structure and which node and mark types are available.                                                                                                                                                                |
| `rules`   | readonly [`ParseRule`](../../../types/dom-parser/ParseRule/type-aliases/ParseRule.md)[] | The set of [parse rules](#model.ParseRule) that the parser uses, in order of precedence. Can include both tag-based rules (matching DOM elements) and style-based rules (matching CSS properties). Rules are processed in the order provided, with earlier rules taking precedence. |

#### Returns

`DOMParser`

## Accessors

### matchedStyles

#### Get Signature

```ts
get matchedStyles(): readonly string[];
```

Defined in: [packages/model/src/dom-parser/DOMParser.ts:140](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/dom-parser/DOMParser.ts#L140)

Get the list of CSS property names that have associated style parse rules.

This is used by the parser to optimize style matching by only checking
CSS properties that have relevant rules defined.

##### Returns

readonly `string`[]

A readonly array of CSS property names (e.g., ["font-weight", "color"]).

---

### normalizeLists

#### Get Signature

```ts
get normalizeLists(): boolean;
```

Defined in: [packages/model/src/dom-parser/DOMParser.ts:152](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/dom-parser/DOMParser.ts#L152)

Get whether list normalization should be performed during parsing.

List normalization is needed when the schema doesn't allow list nodes to
directly contain themselves (i.e., nested lists must be wrapped in list items).

##### Returns

`boolean`

True if list normalization should be performed, false otherwise.

---

### schema

#### Get Signature

```ts
get schema(): Schema;
```

Defined in: [packages/model/src/dom-parser/DOMParser.ts:161](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/dom-parser/DOMParser.ts#L161)

Get the ProseMirror schema this parser targets.

##### Returns

[`Schema`](../../../schema/Schema/classes/Schema.md)

The schema that defines the document structure for this parser.

## Methods

### matchStyle()

```ts
matchStyle(
   prop,
   value,
   context,
   after?): StyleParseRule;
```

Defined in: [packages/model/src/dom-parser/DOMParser.ts:404](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/dom-parser/DOMParser.ts#L404)

Find the first matching style parse rule for the given CSS property and value.

This method iterates through the parser's style rules and returns the first rule
that matches the given property name and value. Style rules can match either
just a property name (e.g., "font-weight") or a property-value pair
(e.g., "font-weight=bold"). If a rule has a getAttrs function, it's called
with the value to compute or validate attributes.

#### Parameters

| Parameter | Type                                                                                         | Description                                                                                                                                                                                                  |
| --------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `prop`    | `string`                                                                                     | The CSS property name to match (e.g., "font-weight", "color", "text-decoration"). Must exactly match the property name portion of the style rule.                                                            |
| `value`   | `string`                                                                                     | The CSS property value to match (e.g., "bold", "#ff0000", "underline"). This is checked against style rules that specify a value (property=value format).                                                    |
| `context` | [`DOMParseContext`](../../../types/dom-parser/DOMParseContext/interfaces/DOMParseContext.md) | The current parsing context, used to check context restrictions defined in the rules.                                                                                                                        |
| `after?`  | [`StyleParseRule`](../../../types/dom-parser/StyleParseRule/interfaces/StyleParseRule.md)    | Optional rule to start searching after. Used when iterating through multiple matching rules for the same property-value pair. If provided, the search starts immediately after this rule in the rules array. |

#### Returns

[`StyleParseRule`](../../../types/dom-parser/StyleParseRule/interfaces/StyleParseRule.md)

The first matching style parse rule with its attrs property potentially
modified by getAttrs, or undefined if no matching rule is found.

#### Remarks

**Side Effect Warning**: This method may mutate the returned rule's attrs property
when getAttrs is defined. This is intentional and expected by the parsing context.

#### Example

```typescript
// Match a simple property rule: {style: "font-weight"}
const rule1 = parser.matchStyle("font-weight", "bold", context);

// Match a property-value rule: {style: "font-weight=bold"}
const rule2 = parser.matchStyle("font-weight", "bold", context);
```

---

### matchTag()

```ts
matchTag(
   dom,
   context,
   after?): TagParseRule;
```

Defined in: [packages/model/src/dom-parser/DOMParser.ts:343](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/dom-parser/DOMParser.ts#L343)

Find the first matching tag parse rule for the given DOM element.

This method iterates through the parser's tag rules and returns the first rule
that matches the given element's tag selector, namespace, and parsing context.
If a rule has a getAttrs function, it's called to compute or validate attributes,
and the rule is skipped if it returns false.

#### Parameters

| Parameter | Type                                                                                         | Description                                                                                                                                                                                      |
| --------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `dom`     | `Node`                                                                                       | The DOM node to match against tag rules. Will be cast to Element for selector matching and to HTMLElement for getAttrs calls.                                                                    |
| `context` | [`DOMParseContext`](../../../types/dom-parser/DOMParseContext/interfaces/DOMParseContext.md) | The current parsing context, used to check context restrictions defined in the rules (e.g., "paragraph/" or "blockquote/paragraph/").                                                            |
| `after?`  | [`TagParseRule`](../../../types/dom-parser/TagParseRule/interfaces/TagParseRule.md)          | Optional rule to start searching after. Used when iterating through multiple matching rules for the same element. If provided, the search starts immediately after this rule in the rules array. |

#### Returns

[`TagParseRule`](../../../types/dom-parser/TagParseRule/interfaces/TagParseRule.md)

The first matching tag parse rule with its attrs property potentially
modified by getAttrs, or undefined if no matching rule is found.

#### Remarks

**Side Effect Warning**: This method may mutate the returned rule's attrs property
when getAttrs is defined. This is intentional and expected by the parsing context,
which relies on the attrs being set on the rule object.

---

### parse()

```ts
parse(dom, options?): Node;
```

Defined in: [packages/model/src/dom-parser/DOMParser.ts:465](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/dom-parser/DOMParser.ts#L465)

Parse a document from the content of a DOM node.

This method creates a complete ProseMirror document by parsing the given DOM node
and its children according to the parser's rules. The resulting document will
conform to the parser's schema constraints.

#### Parameters

| Parameter | Type                                                                                | Description                                                                                                                                                                                                                                                                                                                                                                                                                     |
| --------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dom`     | `string` \| `Node` \| `Element`                                                     | The DOM node whose content should be parsed. Can be any DOM node type (Element, Text, DocumentFragment, etc.). The node's children will be recursively parsed. Can also be a HTML string.                                                                                                                                                                                                                                       |
| `options` | [`ParseOptions`](../../../types/dom-parser/ParseOptions/interfaces/ParseOptions.md) | Optional parsing configuration object: - `preserveWhitespace`: Controls whitespace handling (boolean or "full") - `findPositions`: Array of DOM nodes to track positions for - `from`: Starting index in the DOM node's children - `to`: Ending index in the DOM node's children - `topNode`: The node type to use as document root - `topMatch`: Content match to use for the document - `context`: Additional parsing context |

#### Returns

[`Node`](../../../elements/Node/classes/Node.md)

A ProseMirror node representing the parsed document. This will be a
complete, valid node according to the schema's constraints.

#### Example

```typescript
const parser = DOMParser.fromSchema(mySchema);

// Parse an entire document
const doc = parser.parse(document.body);

// Parse with options
const doc2 = parser.parse(domElement, {
  preserveWhitespace: true,
  from: 0,
  to: 10,
});
```

---

### parseSlice()

```ts
parseSlice(dom, options?): Slice;
```

Defined in: [packages/model/src/dom-parser/DOMParser.ts:521](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/dom-parser/DOMParser.ts#L521)

Parses the content of the given DOM node, like
[`parse`](#model.DOMParser.parse), and takes the same set of
options. But unlike that method, which produces a whole node,
this one returns a slice that is open at the sides, meaning that
the schema constraints aren't applied to the start of nodes to
the left of the input and the end of nodes at the end.

This is particularly useful for parsing content that will be inserted
into an existing document, such as clipboard content or drag-and-drop data,
where you want to preserve the structure without forcing it to be a
complete document.

#### Parameters

| Parameter | Type                                                                                | Description                                                                                                                                                                                                                                                                                                                                                                                                 |
| --------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dom`     | `Node`                                                                              | The DOM node whose content should be parsed. Can be any DOM node type. The content will be parsed more leniently than in `parse()`, allowing partial structures.                                                                                                                                                                                                                                            |
| `options` | [`ParseOptions`](../../../types/dom-parser/ParseOptions/interfaces/ParseOptions.md) | Optional parsing configuration object (same as [parse](#parse)): - `preserveWhitespace`: Controls whitespace handling - `findPositions`: Array of DOM nodes to track positions for - `from`: Starting index in the DOM node's children - `to`: Ending index in the DOM node's children - `topNode`: The node type to use as root - `topMatch`: Content match to use - `context`: Additional parsing context |

#### Returns

[`Slice`](../../../elements/Slice/classes/Slice.md)

A slice representing the parsed content with open sides. The slice's
`openStart` and `openEnd` properties indicate how many parent nodes
are "open" at the start and end, allowing the content to be inserted
flexibly into different contexts.

#### Example

```typescript
const parser = DOMParser.fromSchema(mySchema);

// Parse clipboard content as a slice
const slice = parser.parseSlice(clipboardData);

// Insert the slice into a document at a position
const tr = state.tr.replaceRange(from, to, slice);
```

---

### fromSchema()

```ts
static fromSchema(schema): DOMParser;
```

Defined in: [packages/model/src/dom-parser/DOMParser.ts:199](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/dom-parser/DOMParser.ts#L199)

Construct a DOM parser using the parsing rules listed in a
schema's [node specs](#model.NodeSpec.parseDOM) and
[mark specs](#model.MarkSpec.parseDOM), reordered by
[priority](#model.GenericParseRule.priority).

The parser is cached on the schema object for reuse, so subsequent
calls with the same schema will return the same parser instance.

This is the recommended way to create a parser, as it automatically
extracts all parse rules from the schema's node and mark specifications.

#### Parameters

| Parameter | Type                                                 | Description                                                                                                                                                 |
| --------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schema`  | [`Schema`](../../../schema/Schema/classes/Schema.md) | The schema to extract parsing rules from. All parseDOM rules defined in the schema's node and mark specifications will be collected and sorted by priority. |

#### Returns

`DOMParser`

A DOM parser instance configured for the given schema. Returns the
cached instance if one exists, otherwise creates and caches a new one.

#### Example

```typescript
const schema = new Schema({
  nodes: {
    doc: { content: "block+" },
    paragraph: {
      parseDOM: [{ tag: "p" }],
      toDOM: () => ["p", 0],
    },
  },
});

const parser = DOMParser.fromSchema(schema);
const doc = parser.parse(document.querySelector("#content"));
```

---

### schemaRules()

```ts
static schemaRules(schema): ParseRule[];
```

Defined in: [packages/model/src/dom-parser/DOMParser.ts:235](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/dom-parser/DOMParser.ts#L235)

Extract and combine all parsing rules from a schema's node and mark specifications,
sorted by priority (higher priority rules come first).

This method iterates through all mark types and node types in the schema,
collecting their parseDOM rules. Each rule is copied to avoid mutation of
the original schema specifications. If a rule doesn't specify which mark
or node it creates, that information is filled in based on the type it
came from.

The resulting array is sorted by priority (default 50), with higher priority
rules appearing first. This ensures that more specific rules are tried before
more general ones during parsing.

#### Parameters

| Parameter | Type                                                 | Description                                                                                       |
| --------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `schema`  | [`Schema`](../../../schema/Schema/classes/Schema.md) | The schema to extract rules from. Must contain node and mark specifications with parseDOM arrays. |

#### Returns

[`ParseRule`](../../../types/dom-parser/ParseRule/type-aliases/ParseRule.md)[]

An array of parse rules sorted by priority in descending order
(highest priority first). Each rule is a copy of the original with
mark/node names filled in where needed.

#### Example

```typescript
const schema = new Schema({
  nodes: { doc: {}, paragraph: { parseDOM: [{ tag: "p" }] } },
  marks: { strong: { parseDOM: [{ tag: "strong" }] } },
});

const rules = DOMParser.schemaRules(schema);
// Returns array with strong and paragraph rules, sorted by priority
```
