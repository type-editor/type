[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/markdown](../../../README.md) / [to-markdown/MarkdownSerializerState](../README.md) / MarkdownSerializerState

# Class: MarkdownSerializerState

Defined in: [to-markdown/MarkdownSerializerState.ts:13](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/MarkdownSerializerState.ts#L13)

This is an object used to track state and expose
methods related to markdown serialization. Instances are passed to
node and mark serialization methods (see `toMarkdown`).

## Constructors

### Constructor

```ts
new MarkdownSerializerState(
   nodes,
   marks,
   options): MarkdownSerializerState;
```

Defined in: [to-markdown/MarkdownSerializerState.ts:40](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/MarkdownSerializerState.ts#L40)

Create a new serializer state for tracking the markdown serialization process.

#### Parameters

| Parameter | Type                                                                                                                   | Description                                                         |
| --------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `nodes`   | `Record`&lt;`string`, [`NodeSerializerFunc`](../../../types/NodeSerializerFunc/type-aliases/NodeSerializerFunc.md)&gt; | A record mapping node type names to their serializer functions      |
| `marks`   | `Record`&lt;`string`, [`MarkSerializerSpec`](../../../types/MarkSerializerSpec/interfaces/MarkSerializerSpec.md)&gt;   | A record mapping mark type names to their serializer specifications |
| `options` | [`MarkdownSerializerOptions`](../../../types/MarkdownSerializerOptions/interfaces/MarkdownSerializerOptions.md)        | Configuration options for the serializer behavior                   |

#### Returns

`MarkdownSerializerState`

## Accessors

### closed

#### Get Signature

```ts
get closed(): Node_2;
```

Defined in: [to-markdown/MarkdownSerializerState.ts:66](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/MarkdownSerializerState.ts#L66)

##### Returns

`Node_2`

---

### inAutolink

#### Get Signature

```ts
get inAutolink(): boolean;
```

Defined in: [to-markdown/MarkdownSerializerState.ts:70](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/MarkdownSerializerState.ts#L70)

##### Returns

`boolean`

#### Set Signature

```ts
set inAutolink(inAutolink): void;
```

Defined in: [to-markdown/MarkdownSerializerState.ts:74](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/MarkdownSerializerState.ts#L74)

##### Parameters

| Parameter    | Type      |
| ------------ | --------- |
| `inAutolink` | `boolean` |

##### Returns

`void`

---

### out

#### Get Signature

```ts
get out(): string;
```

Defined in: [to-markdown/MarkdownSerializerState.ts:58](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/MarkdownSerializerState.ts#L58)

##### Returns

`string`

#### Set Signature

```ts
set out(out): void;
```

Defined in: [to-markdown/MarkdownSerializerState.ts:62](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/MarkdownSerializerState.ts#L62)

##### Parameters

| Parameter | Type     |
| --------- | -------- |
| `out`     | `string` |

##### Returns

`void`

## Methods

### atBlank()

```ts
atBlank(): boolean;
```

Defined in: [to-markdown/MarkdownSerializerState.ts:132](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/MarkdownSerializerState.ts#L132)

Check if the output is currently at a blank position (empty or ends with newline).

#### Returns

`boolean`

True if the output is empty or ends with a newline

---

### closeBlock()

```ts
closeBlock(node): void;
```

Defined in: [to-markdown/MarkdownSerializerState.ts:168](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/MarkdownSerializerState.ts#L168)

Close the block for the given node.

#### Parameters

| Parameter | Type     | Description                          |
| --------- | -------- | ------------------------------------ |
| `node`    | `Node_2` | The node whose block is being closed |

#### Returns

`void`

---

### ensureNewLine()

```ts
ensureNewLine(): void;
```

Defined in: [to-markdown/MarkdownSerializerState.ts:139](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/MarkdownSerializerState.ts#L139)

Ensure the current content ends with a newline.

#### Returns

`void`

---

### esc()

```ts
esc(str, startOfLine?): string;
```

Defined in: [to-markdown/MarkdownSerializerState.ts:422](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/MarkdownSerializerState.ts#L422)

Escape the given string so that it can safely appear in Markdown
content. If `startOfLine` is true, also escape characters that
have special meaning only at the start of the line.

#### Parameters

| Parameter     | Type      | Default value | Description                                             |
| ------------- | --------- | ------------- | ------------------------------------------------------- |
| `str`         | `string`  | `undefined`   | The string to escape                                    |
| `startOfLine` | `boolean` | `false`       | Whether to also escape start-of-line special characters |

#### Returns

`string`

The escaped string

---

### flushClose()

```ts
flushClose(size?): void;
```

Defined in: [to-markdown/MarkdownSerializerState.ts:83](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/MarkdownSerializerState.ts#L83)

Flush a closed block, adding blank lines as needed.

#### Parameters

| Parameter | Type     | Default value | Description                                   |
| --------- | -------- | ------------- | --------------------------------------------- |
| `size`    | `number` | `2`           | The number of blank lines to add (default: 2) |

#### Returns

`void`

---

### getEnclosingWhitespace()

```ts
getEnclosingWhitespace(text): {
  leading?: string;
  trailing?: string;
};
```

Defined in: [to-markdown/MarkdownSerializerState.ts:502](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/MarkdownSerializerState.ts#L502)

Get leading and trailing whitespace from a string. Values of
leading or trailing property of the return object will be undefined
if there is no match.

#### Parameters

| Parameter | Type     | Description                         |
| --------- | -------- | ----------------------------------- |
| `text`    | `string` | The text to extract whitespace from |

#### Returns

```ts
{
  leading?: string;
  trailing?: string;
}
```

An object containing the leading and trailing whitespace (if any)

| Name        | Type     | Defined in                                                                                                                                                                                        |
| ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `leading?`  | `string` | [to-markdown/MarkdownSerializerState.ts:502](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/MarkdownSerializerState.ts#L502) |
| `trailing?` | `string` | [to-markdown/MarkdownSerializerState.ts:502](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/MarkdownSerializerState.ts#L502) |

---

### markString()

```ts
markString(
   mark,
   open,
   parent,
   index): string;
```

Defined in: [to-markdown/MarkdownSerializerState.ts:485](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/MarkdownSerializerState.ts#L485)

Get the markdown string for a given opening or closing mark.

#### Parameters

| Parameter | Type      | Description                                                 |
| --------- | --------- | ----------------------------------------------------------- |
| `mark`    | `Mark`    | The mark to get the string for                              |
| `open`    | `boolean` | Whether to get the opening (true) or closing (false) string |
| `parent`  | `Node_2`  | The parent node containing the marked content               |
| `index`   | `number`  | The index of the marked content within its parent           |

#### Returns

`string`

The markdown string for the mark

---

### quote()

```ts
quote(str): string;
```

Defined in: [to-markdown/MarkdownSerializerState.ts:455](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/MarkdownSerializerState.ts#L455)

Wrap a string with appropriate quote characters.
Chooses double quotes, single quotes, or parentheses based on the content.

#### Parameters

| Parameter | Type     | Description         |
| --------- | -------- | ------------------- |
| `str`     | `string` | The string to quote |

#### Returns

`string`

The quoted string

---

### renderContent()

```ts
renderContent(parent): void;
```

Defined in: [to-markdown/MarkdownSerializerState.ts:202](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/MarkdownSerializerState.ts#L202)

Render the contents of `parent` as block nodes.

#### Parameters

| Parameter | Type     | Description                                     |
| --------- | -------- | ----------------------------------------------- |
| `parent`  | `Node_2` | The parent node whose children will be rendered |

#### Returns

`void`

---

### renderInline()

```ts
renderInline(parent, fromBlockStart?): void;
```

Defined in: [to-markdown/MarkdownSerializerState.ts:214](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/MarkdownSerializerState.ts#L214)

Render the contents of `parent` as inline content.

#### Parameters

| Parameter        | Type      | Default value | Description                                            |
| ---------------- | --------- | ------------- | ------------------------------------------------------ |
| `parent`         | `Node_2`  | `undefined`   | The parent node whose inline content will be rendered  |
| `fromBlockStart` | `boolean` | `true`        | Whether rendering starts from the beginning of a block |

#### Returns

`void`

---

### renderList()

```ts
renderList(
   node,
   delim,
   firstDelim): void;
```

Defined in: [to-markdown/MarkdownSerializerState.ts:388](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/MarkdownSerializerState.ts#L388)

Render a node's content as a list. `delim` should be the extra
indentation added to all lines except the first in an item,
`firstDelim` is a function going from an item index to a
delimiter for the first line of the item.

#### Parameters

| Parameter    | Type                  | Description                                                           |
| ------------ | --------------------- | --------------------------------------------------------------------- |
| `node`       | `Node_2`              | The list node to render                                               |
| `delim`      | `string`              | The delimiter/indentation for continuation lines                      |
| `firstDelim` | (`index`) => `string` | A function that returns the delimiter for the first line of each item |

#### Returns

`void`

---

### repeat()

```ts
repeat(str, n): string;
```

Defined in: [to-markdown/MarkdownSerializerState.ts:472](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/MarkdownSerializerState.ts#L472)

Repeat the given string `n` times.

#### Parameters

| Parameter | Type     | Description                              |
| --------- | -------- | ---------------------------------------- |
| `str`     | `string` | The string to repeat                     |
| `n`       | `number` | The number of times to repeat the string |

#### Returns

`string`

The repeated string

---

### text()

```ts
text(text, escape?): void;
```

Defined in: [to-markdown/MarkdownSerializerState.ts:179](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/MarkdownSerializerState.ts#L179)

Add the given text to the document. When escape is not `false`,
it will be escaped.

#### Parameters

| Parameter | Type      | Default value | Description                                                   |
| --------- | --------- | ------------- | ------------------------------------------------------------- |
| `text`    | `string`  | `undefined`   | The text content to add                                       |
| `escape`  | `boolean` | `true`        | Whether to escape special Markdown characters (default: true) |

#### Returns

`void`

---

### wrapBlock()

```ts
wrapBlock(
   delim,
   firstDelim,
   node,
   callbackFunc): void;
```

Defined in: [to-markdown/MarkdownSerializerState.ts:115](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/MarkdownSerializerState.ts#L115)

Render a block, prefixing each line with `delim`, and the first
line in `firstDelim`. `node` should be the node that is closed at
the end of the block, and `callbackFunc` is a function that renders the
content of the block.

#### Parameters

| Parameter      | Type         | Description                                             |
| -------------- | ------------ | ------------------------------------------------------- |
| `delim`        | `string`     | The delimiter to prefix to each line                    |
| `firstDelim`   | `string`     | The delimiter for the first line (uses `delim` if null) |
| `node`         | `Node_2`     | The node being wrapped                                  |
| `callbackFunc` | () => `void` | A function that renders the block content               |

#### Returns

`void`

---

### write()

```ts
write(content?): void;
```

Defined in: [to-markdown/MarkdownSerializerState.ts:152](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/MarkdownSerializerState.ts#L152)

Prepare the state for writing output (closing closed paragraphs,
adding delimiters, and so on), and then optionally add content
(unescaped) to the output.

#### Parameters

| Parameter  | Type     | Description                                       |
| ---------- | -------- | ------------------------------------------------- |
| `content?` | `string` | Optional content to add to the output (unescaped) |

#### Returns

`void`
