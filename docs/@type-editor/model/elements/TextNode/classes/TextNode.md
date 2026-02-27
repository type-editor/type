[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/model](../../../README.md) / [elements/TextNode](../README.md) / TextNode

# Class: TextNode

Defined in: [packages/model/src/elements/TextNode.ts:17](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/TextNode.ts#L17)

A text node represents a piece of text in the document. Text nodes
are leaf nodes that contain only text content and cannot have children.
They can have marks applied to them (like bold, italic, links, etc.).

## Extends

- [`Node`](../../Node/classes/Node.md)

## Implements

- [`PmElement`](../../../types/elements/PmElement/interfaces/PmElement.md)

## Constructors

### Constructor

```ts
new TextNode(
   type,
   attrs,
   content,
   marks?): TextNode;
```

Defined in: [packages/model/src/elements/TextNode.ts:29](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/TextNode.ts#L29)

Create a text node. For most use cases, you should use
Schema's text() method instead of calling this directly.

#### Parameters

| Parameter | Type                                                         | Description                                                   |
| --------- | ------------------------------------------------------------ | ------------------------------------------------------------- |
| `type`    | [`NodeType`](../../../schema/NodeType/classes/NodeType.md)   | The node type (should be the text node type from the schema). |
| `attrs`   | [`Attrs`](../../../types/schema/Attrs/type-aliases/Attrs.md) | The node's attributes.                                        |
| `content` | `string`                                                     | The text content of this node.                                |
| `marks?`  | readonly [`Mark`](../../Mark/classes/Mark.md)[]              | The marks applied to this text node.                          |

#### Returns

`TextNode`

#### Throws

If the content is empty (empty text nodes are not allowed).

#### Overrides

[`Node`](../../Node/classes/Node.md).[`constructor`](../../Node/classes/Node.md#constructor)

## Properties

| Property                                  | Modifier    | Type                                                         | Default value | Description                                            | Inherited from                                                                                  | Defined in                                                                                                                                                          |
| ----------------------------------------- | ----------- | ------------------------------------------------------------ | ------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-_attrs"></a> `_attrs`     | `readonly`  | [`Attrs`](../../../types/schema/Attrs/type-aliases/Attrs.md) | `undefined`   | -                                                      | [`Node`](../../Node/classes/Node.md).[`_attrs`](../../Node/classes/Node.md#property-_attrs)     | [packages/model/src/elements/Node.ts:39](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L39) |
| <a id="property-_content"></a> `_content` | `readonly`  | [`Fragment`](../../Fragment/classes/Fragment.md)             | `undefined`   | A container holding the node's children.               | [`Node`](../../Node/classes/Node.md).[`_content`](../../Node/classes/Node.md#property-_content) | [packages/model/src/elements/Node.ts:38](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L38) |
| <a id="property-_marks"></a> `_marks`     | `readonly`  | readonly [`Mark`](../../Mark/classes/Mark.md)[]              | `undefined`   | -                                                      | [`Node`](../../Node/classes/Node.md).[`_marks`](../../Node/classes/Node.md#property-_marks)     | [packages/model/src/elements/Node.ts:40](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L40) |
| <a id="property-_tag"></a> `_tag`         | `protected` | `Record`&lt;`string`, `number`&gt;                           | `{}`          | -                                                      | [`Node`](../../Node/classes/Node.md).[`_tag`](../../Node/classes/Node.md#property-_tag)         | [packages/model/src/elements/Node.ts:42](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L42) |
| <a id="property-_text"></a> `_text`       | `readonly`  | `string`                                                     | `undefined`   | For text nodes, this contains the node's text content. | [`Node`](../../Node/classes/Node.md).[`_text`](../../Node/classes/Node.md#property-_text)       | [packages/model/src/elements/Node.ts:46](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L46) |
| <a id="property-nodetype"></a> `nodeType` | `readonly`  | [`NodeType`](../../../schema/NodeType/classes/NodeType.md)   | `undefined`   | -                                                      | [`Node`](../../Node/classes/Node.md).[`nodeType`](../../Node/classes/Node.md#property-nodetype) | [packages/model/src/elements/Node.ts:41](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L41) |

## Accessors

### attrs

#### Get Signature

```ts
get attrs(): Attrs;
```

Defined in: [packages/model/src/elements/Node.ts:115](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L115)

An object mapping attribute names to values.

##### Returns

[`Attrs`](../../../types/schema/Attrs/type-aliases/Attrs.md)

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`attrs`](../../Node/classes/Node.md#attrs)

---

### childCount

#### Get Signature

```ts
get childCount(): number;
```

Defined in: [packages/model/src/elements/Node.ts:147](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L147)

The number of children that the node has.

##### Returns

`number`

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`childCount`](../../Node/classes/Node.md#childcount)

---

### children

#### Get Signature

```ts
get children(): readonly Node[];
```

Defined in: [packages/model/src/elements/Node.ts:129](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L129)

The array of this node's child nodes.

##### Returns

readonly [`Node`](../../Node/classes/Node.md)[]

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`children`](../../Node/classes/Node.md#children)

---

### content

#### Get Signature

```ts
get content(): Fragment;
```

Defined in: [packages/model/src/elements/Node.ts:94](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L94)

A fragment containing the node's children.

##### Returns

[`Fragment`](../../Fragment/classes/Fragment.md)

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`content`](../../Node/classes/Node.md#content)

---

### elementType

#### Get Signature

```ts
get elementType(): ElementType;
```

Defined in: [packages/model/src/elements/TextNode.ts:41](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/TextNode.ts#L41)

##### Returns

[`ElementType`](../../ElementType/enumerations/ElementType.md)

#### Implementation of

[`PmElement`](../../../types/elements/PmElement/interfaces/PmElement.md).[`elementType`](../../../types/elements/PmElement/interfaces/PmElement.md#property-elementtype)

#### Overrides

[`Node`](../../Node/classes/Node.md).[`elementType`](../../Node/classes/Node.md#elementtype)

---

### firstChild

#### Get Signature

```ts
get firstChild(): Node;
```

Defined in: [packages/model/src/elements/Node.ts:165](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L165)

Returns this node's first child, or `null` if there are no
children.

##### Returns

[`Node`](../../Node/classes/Node.md)

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`firstChild`](../../Node/classes/Node.md#firstchild)

---

### inlineContent

#### Get Signature

```ts
get inlineContent(): boolean;
```

Defined in: [packages/model/src/elements/Node.ts:195](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L195)

True when this node allows inline content.

##### Returns

`boolean`

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`inlineContent`](../../Node/classes/Node.md#inlinecontent)

---

### isAtom

#### Get Signature

```ts
get isAtom(): boolean;
```

Defined in: [packages/model/src/elements/Node.ts:228](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L228)

True when this is an atom, i.e. when it does not have directly
editable content. This is usually the same as `isLeaf`, but can
be configured with the [`atom` property](#model.NodeSpec.atom)
on a node's spec (typically used when the node is displayed as
an uneditable [node view](#view.NodeView)).

##### Returns

`boolean`

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`isAtom`](../../Node/classes/Node.md#isatom)

---

### isBlock

#### Get Signature

```ts
get isBlock(): boolean;
```

Defined in: [packages/model/src/elements/Node.ts:180](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L180)

True when this is a block (non-inline node)

##### Returns

`boolean`

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`isBlock`](../../Node/classes/Node.md#isblock)

---

### isInline

#### Get Signature

```ts
get isInline(): boolean;
```

Defined in: [packages/model/src/elements/Node.ts:203](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L203)

True when this is an inline node (a text node or a node that can
appear among text).

##### Returns

`boolean`

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`isInline`](../../Node/classes/Node.md#isinline)

---

### isLeaf

#### Get Signature

```ts
get isLeaf(): boolean;
```

Defined in: [packages/model/src/elements/Node.ts:217](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L217)

True when this is a leaf node.

##### Returns

`boolean`

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`isLeaf`](../../Node/classes/Node.md#isleaf)

---

### isText

#### Get Signature

```ts
get isText(): boolean;
```

Defined in: [packages/model/src/elements/Node.ts:210](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L210)

True when this is a text node.

##### Returns

`boolean`

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`isText`](../../Node/classes/Node.md#istext)

---

### isTextblock

#### Get Signature

```ts
get isTextblock(): boolean;
```

Defined in: [packages/model/src/elements/Node.ts:188](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L188)

True when this is a textblock node, a block node with inline
content.

##### Returns

`boolean`

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`isTextblock`](../../Node/classes/Node.md#istextblock)

---

### lastChild

#### Get Signature

```ts
get lastChild(): Node;
```

Defined in: [packages/model/src/elements/Node.ts:173](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L173)

Returns this node's last child, or `null` if there are no
children.

##### Returns

[`Node`](../../Node/classes/Node.md)

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`lastChild`](../../Node/classes/Node.md#lastchild)

---

### marks

#### Get Signature

```ts
get marks(): readonly Mark[];
```

Defined in: [packages/model/src/elements/Node.ts:122](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L122)

The marks applied to this node.

##### Returns

readonly [`Mark`](../../Mark/classes/Mark.md)[]

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`marks`](../../Node/classes/Node.md#marks)

---

### nodeSize

#### Get Signature

```ts
get nodeSize(): number;
```

Defined in: [packages/model/src/elements/TextNode.ts:58](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/TextNode.ts#L58)

The size of this text node, which equals the length of its text content.

##### Returns

`number`

#### Overrides

[`Node`](../../Node/classes/Node.md).[`nodeSize`](../../Node/classes/Node.md#nodesize)

---

### tag

#### Get Signature

```ts
get tag(): Record<string, number>;
```

Defined in: [packages/model/src/elements/Node.ts:79](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L79)

##### Returns

`Record`&lt;`string`, `number`&gt;

#### Set Signature

```ts
set tag(tag): void;
```

Defined in: [packages/model/src/elements/Node.ts:83](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L83)

##### Parameters

| Parameter | Type                               |
| --------- | ---------------------------------- |
| `tag`     | `Record`&lt;`string`, `number`&gt; |

##### Returns

`void`

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`tag`](../../Node/classes/Node.md#tag)

---

### text

#### Get Signature

```ts
get text(): string;
```

Defined in: [packages/model/src/elements/Node.ts:101](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L101)

For text nodes, this contains the node's text content. For other nodes, returns null.

##### Returns

`string`

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`text`](../../Node/classes/Node.md#text)

---

### textContent

#### Get Signature

```ts
get textContent(): string;
```

Defined in: [packages/model/src/elements/TextNode.ts:51](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/TextNode.ts#L51)

The text content of this text node. For text nodes, this returns
the actual text string contained in the node.

##### Returns

`string`

The text content as a string.

#### Overrides

[`Node`](../../Node/classes/Node.md).[`textContent`](../../Node/classes/Node.md#textcontent)

---

### type

#### Get Signature

```ts
get type(): NodeType;
```

Defined in: [packages/model/src/elements/Node.ts:108](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L108)

The type of node that this is.

##### Returns

[`NodeType`](../../../schema/NodeType/classes/NodeType.md)

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`type`](../../Node/classes/Node.md#type)

## Methods

### canAppend()

```ts
canAppend(other): boolean;
```

Defined in: [packages/model/src/elements/Node.ts:747](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L747)

Test whether the given node's content could be appended to this
node. If that node is empty, this will only return true if there
is at least one node type that can appear in both nodes (to avoid
merging completely incompatible nodes).

#### Parameters

| Parameter | Type                                 | Description                                   |
| --------- | ------------------------------------ | --------------------------------------------- |
| `other`   | [`Node`](../../Node/classes/Node.md) | The node whose content to test for appending. |

#### Returns

`boolean`

`true` if the content can be appended, `false` otherwise.

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`canAppend`](../../Node/classes/Node.md#canappend)

---

### canReplace()

```ts
canReplace(
   from,
   to,
   replacement?,
   start?,
   end?): boolean;
```

Defined in: [packages/model/src/elements/Node.ts:696](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L696)

Test whether replacing the range between `from` and `to` (by
child index) with the given replacement fragment (which defaults
to the empty fragment) would leave the node's content valid. You
can optionally pass `start` and `end` indices into the
replacement fragment.

#### Parameters

| Parameter     | Type                                             | Default value            | Description                                                                        |
| ------------- | ------------------------------------------------ | ------------------------ | ---------------------------------------------------------------------------------- |
| `from`        | `number`                                         | `undefined`              | The starting child index.                                                          |
| `to`          | `number`                                         | `undefined`              | The ending child index.                                                            |
| `replacement` | [`Fragment`](../../Fragment/classes/Fragment.md) | `Fragment.empty`         | The replacement fragment. Defaults to an empty fragment.                           |
| `start`       | `number`                                         | `0`                      | The start index in the replacement fragment. Defaults to 0.                        |
| `end`         | `number`                                         | `replacement.childCount` | The end index in the replacement fragment. Defaults to the fragment's child count. |

#### Returns

`boolean`

`true` if the replacement would be valid, `false` otherwise.

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`canReplace`](../../Node/classes/Node.md#canreplace)

---

### canReplaceWith()

```ts
canReplaceWith(
   from,
   to,
   type,
   marks?): boolean;
```

Defined in: [packages/model/src/elements/Node.ts:725](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L725)

Test whether replacing the range `from` to `to` (by index) with
a node of the given type would leave the node's content valid.

#### Parameters

| Parameter | Type                                                       | Description                          |
| --------- | ---------------------------------------------------------- | ------------------------------------ |
| `from`    | `number`                                                   | The starting child index.            |
| `to`      | `number`                                                   | The ending child index.              |
| `type`    | [`NodeType`](../../../schema/NodeType/classes/NodeType.md) | The node type to test.               |
| `marks?`  | readonly [`Mark`](../../Mark/classes/Mark.md)[]            | Optional marks to apply to the node. |

#### Returns

`boolean`

`true` if the replacement would be valid, `false` otherwise.

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`canReplaceWith`](../../Node/classes/Node.md#canreplacewith)

---

### check()

```ts
check(): void;
```

Defined in: [packages/model/src/elements/Node.ts:761](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L761)

Check whether this node and its descendants conform to the
schema, and raise an exception when they do not.

#### Returns

`void`

#### Throws

If the node or its descendants don't conform to the schema.

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`check`](../../Node/classes/Node.md#check)

---

### child()

```ts
child(index): Node;
```

Defined in: [packages/model/src/elements/Node.ts:304](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L304)

Get the child node at the given index. Raises an error when the
index is out of range.

#### Parameters

| Parameter | Type     | Description                                        |
| --------- | -------- | -------------------------------------------------- |
| `index`   | `number` | The index of the child node to retrieve (0-based). |

#### Returns

[`Node`](../../Node/classes/Node.md)

The child node at the specified index.

#### Throws

If the index is out of range.

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`child`](../../Node/classes/Node.md#child)

---

### childAfter()

```ts
childAfter(pos): {
  index: number;
  node: Node;
  offset: number;
};
```

Defined in: [packages/model/src/elements/Node.ts:581](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L581)

Find the (direct) child node after the given offset, if any,
and return it along with its index and offset relative to this
node.

#### Parameters

| Parameter | Type     | Description                  |
| --------- | -------- | ---------------------------- |
| `pos`     | `number` | The position to search from. |

#### Returns

```ts
{
  index: number;
  node: Node;
  offset: number;
}
```

An object containing the node, its index, and its offset.

| Name     | Type                                 | Defined in                                                                                                                                                            |
| -------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index`  | `number`                             | [packages/model/src/elements/Node.ts:581](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L581) |
| `node`   | [`Node`](../../Node/classes/Node.md) | [packages/model/src/elements/Node.ts:581](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L581) |
| `offset` | `number`                             | [packages/model/src/elements/Node.ts:581](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L581) |

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`childAfter`](../../Node/classes/Node.md#childafter)

---

### childBefore()

```ts
childBefore(pos): {
  index: number;
  node: Node;
  offset: number;
};
```

Defined in: [packages/model/src/elements/Node.ts:594](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L594)

Find the (direct) child node before the given offset, if any,
and return it along with its index and offset relative to this
node.

#### Parameters

| Parameter | Type     | Description                  |
| --------- | -------- | ---------------------------- |
| `pos`     | `number` | The position to search from. |

#### Returns

```ts
{
  index: number;
  node: Node;
  offset: number;
}
```

An object containing the node, its index, and its offset.

| Name     | Type                                 | Defined in                                                                                                                                                            |
| -------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index`  | `number`                             | [packages/model/src/elements/Node.ts:594](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L594) |
| `node`   | [`Node`](../../Node/classes/Node.md) | [packages/model/src/elements/Node.ts:594](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L594) |
| `offset` | `number`                             | [packages/model/src/elements/Node.ts:594](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L594) |

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`childBefore`](../../Node/classes/Node.md#childbefore)

---

### contentMatchAt()

```ts
contentMatchAt(index): ContentMatch;
```

Defined in: [packages/model/src/elements/Node.ts:674](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L674)

Get the content match in this node at the given index.

#### Parameters

| Parameter | Type     | Description                                  |
| --------- | -------- | -------------------------------------------- |
| `index`   | `number` | The child index to get the content match at. |

#### Returns

[`ContentMatch`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md)

The content match at the specified index.

#### Throws

If the node has invalid content.

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`contentMatchAt`](../../Node/classes/Node.md#contentmatchat)

---

### copy()

```ts
copy(content?): Node;
```

Defined in: [packages/model/src/elements/Node.ts:471](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L471)

Create a new node with the same markup as this node, containing
the given content (or empty, if no content is given).

#### Parameters

| Parameter | Type                                             | Default value | Description                                                   |
| --------- | ------------------------------------------------ | ------------- | ------------------------------------------------------------- |
| `content` | [`Fragment`](../../Fragment/classes/Fragment.md) | `null`        | The content for the new node. If null, creates an empty node. |

#### Returns

[`Node`](../../Node/classes/Node.md)

A new node with the same markup but different content, or this node if content is unchanged.

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`copy`](../../Node/classes/Node.md#copy)

---

### cut()

```ts
cut(from?, to?): TextNode;
```

Defined in: [packages/model/src/elements/TextNode.ts:144](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/TextNode.ts#L144)

Create a copy of this text node containing only the text between
the given positions.

#### Parameters

| Parameter | Type     | Default value | Description                                           |
| --------- | -------- | ------------- | ----------------------------------------------------- |
| `from`    | `number` | `0`           | The starting position. Defaults to 0.                 |
| `to?`     | `number` | `undefined`   | The ending position. Defaults to the end of the text. |

#### Returns

`TextNode`

A new text node with the specified text range, or this node if the range is unchanged.

#### Overrides

[`Node`](../../Node/classes/Node.md).[`cut`](../../Node/classes/Node.md#cut)

---

### descendants()

```ts
descendants(callbackFunc): void;
```

Defined in: [packages/model/src/elements/Node.ts:366](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L366)

Call the given callback for every descendant node. Doesn't
descend into a node when the callback returns `false`.

#### Parameters

| Parameter      | Type                                                      | Description                                                                                                        |
| -------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `callbackFunc` | (`node`, `pos`, `parent`, `index`) => `boolean` \| `void` | The callback function to invoke for each descendant node. Return `false` to skip recursing into a node's children. |

#### Returns

`void`

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`descendants`](../../Node/classes/Node.md#descendants)

---

### eq()

```ts
eq(other): boolean;
```

Defined in: [packages/model/src/elements/TextNode.ts:161](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/TextNode.ts#L161)

Test whether this text node is equal to another node.

#### Parameters

| Parameter | Type                                 | Description               |
| --------- | ------------------------------------ | ------------------------- |
| `other`   | [`Node`](../../Node/classes/Node.md) | The node to compare with. |

#### Returns

`boolean`

`true` if the nodes have the same markup and text content, `false` otherwise.

#### Overrides

[`Node`](../../Node/classes/Node.md).[`eq`](../../Node/classes/Node.md#eq)

---

### forEach()

```ts
forEach(callbackFunc): void;
```

Defined in: [packages/model/src/elements/Node.ts:325](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L325)

Call `f` for every child node, passing the node, it's offset
into this parent node, and its index.

#### Parameters

| Parameter      | Type                                  | Description                                                                                                 |
| -------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `callbackFunc` | (`node`, `offset`, `index`) => `void` | The callback function to invoke for each child node. Receives the node, its offset position, and its index. |

#### Returns

`void`

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`forEach`](../../Node/classes/Node.md#foreach)

---

### hasMarkup()

```ts
hasMarkup(
   type,
   attrs?,
   marks?): boolean;
```

Defined in: [packages/model/src/elements/Node.ts:424](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L424)

Check whether this node's markup correspond to the given type,
attributes, and marks.

#### Parameters

| Parameter | Type                                                       | Description                                                              |
| --------- | ---------------------------------------------------------- | ------------------------------------------------------------------------ |
| `type`    | [`NodeType`](../../../schema/NodeType/classes/NodeType.md) | The node type to check against.                                          |
| `attrs?`  | `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt;          | The attributes to check against (defaults to type's default attributes). |
| `marks?`  | readonly [`Mark`](../../Mark/classes/Mark.md)[]            | The marks to check against (defaults to no marks).                       |

#### Returns

`boolean`

`true` if the markup matches, `false` otherwise.

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`hasMarkup`](../../Node/classes/Node.md#hasmarkup)

---

### mark()

```ts
mark(marks): TextNode;
```

Defined in: [packages/model/src/elements/TextNode.ts:119](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/TextNode.ts#L119)

Create a copy of this text node with the given marks applied.

#### Parameters

| Parameter | Type                                            | Description                              |
| --------- | ----------------------------------------------- | ---------------------------------------- |
| `marks`   | readonly [`Mark`](../../Mark/classes/Mark.md)[] | The marks to apply to the new text node. |

#### Returns

`TextNode`

A new text node with the specified marks, or this node if marks are unchanged.

#### Overrides

[`Node`](../../Node/classes/Node.md).[`mark`](../../Node/classes/Node.md#mark)

---

### maybeChild()

```ts
maybeChild(index): Node;
```

Defined in: [packages/model/src/elements/Node.ts:314](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L314)

Get the child node at the given index, if it exists.

#### Parameters

| Parameter | Type     | Description                                        |
| --------- | -------- | -------------------------------------------------- |
| `index`   | `number` | The index of the child node to retrieve (0-based). |

#### Returns

[`Node`](../../Node/classes/Node.md)

The child node at the specified index, or null if the index is out of range.

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`maybeChild`](../../Node/classes/Node.md#maybechild)

---

### nodeAt()

```ts
nodeAt(pos?): Node;
```

Defined in: [packages/model/src/elements/Node.ts:553](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L553)

Find the node directly after the given position.

#### Parameters

| Parameter | Type     | Description                  |
| --------- | -------- | ---------------------------- |
| `pos?`    | `number` | The position to search from. |

#### Returns

[`Node`](../../Node/classes/Node.md)

The node at the specified position, or null if no node is found.

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`nodeAt`](../../Node/classes/Node.md#nodeat)

---

### nodesBetween()

```ts
nodesBetween(
   from,
   to,
   callbackFunc,
   startPos?): void;
```

Defined in: [packages/model/src/elements/Node.ts:348](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L348)

Invoke a callback for all descendant nodes recursively overlapping
the given two positions that are relative to start of this
node's content. This includes all ancestors of the nodes
containing the two positions. The callback is invoked with the
node, its position relative to the original node (method receiver),
its parent node, and its child index. When the callback returns
false for a given node, that node's children will not be
recursed over. The last parameter can be used to specify a
starting position to count from.

#### Parameters

| Parameter      | Type                                                      | Default value | Description                                                                                             |
| -------------- | --------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------- |
| `from`         | `number`                                                  | `undefined`   | The starting position (inclusive).                                                                      |
| `to`           | `number`                                                  | `undefined`   | The ending position (exclusive).                                                                        |
| `callbackFunc` | (`node`, `pos`, `parent`, `index`) => `boolean` \| `void` | `undefined`   | The callback function to invoke for each node. Return `false` to skip recursing into a node's children. |
| `startPos`     | `number`                                                  | `0`           | The starting position offset for counting. Defaults to 0.                                               |

#### Returns

`void`

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`nodesBetween`](../../Node/classes/Node.md#nodesbetween)

---

### rangeHasMark()

```ts
rangeHasMark(
   from,
   to,
   type): boolean;
```

Defined in: [packages/model/src/elements/Node.ts:638](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L638)

Test whether a given mark or mark type occurs in this document
between the two given positions.

#### Parameters

| Parameter | Type                                                                                                  | Description                          |
| --------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `from`    | `number`                                                                                              | The starting position.               |
| `to`      | `number`                                                                                              | The ending position.                 |
| `type`    | \| [`Mark`](../../Mark/classes/Mark.md) \| [`MarkType`](../../../schema/MarkType/classes/MarkType.md) | The mark or mark type to search for. |

#### Returns

`boolean`

`true` if the mark is found in the range, `false` otherwise.

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`rangeHasMark`](../../Node/classes/Node.md#rangehasmark)

---

### replace()

```ts
replace(
   from,
   to,
   slice): Node;
```

Defined in: [packages/model/src/elements/Node.ts:543](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L543)

Replace the part of the document between the given positions with
the given slice. The slice must 'fit', meaning its open sides
must be able to connect to the surrounding content, and its
content nodes must be valid children for the node they are placed
into. If any of this is violated, an error of type
[`ReplaceError`](#model.ReplaceError) is thrown.

#### Parameters

| Parameter | Type                                    | Description                                    |
| --------- | --------------------------------------- | ---------------------------------------------- |
| `from`    | `number`                                | The starting position of the range to replace. |
| `to`      | `number`                                | The ending position of the range to replace.   |
| `slice`   | [`Slice`](../../Slice/classes/Slice.md) | The slice to insert at the specified position. |

#### Returns

[`Node`](../../Node/classes/Node.md)

A new node with the replacement applied.

#### Throws

If the slice doesn't fit in the specified location.

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`replace`](../../Node/classes/Node.md#replace)

---

### resolve()

```ts
resolve(pos): ResolvedPos;
```

Defined in: [packages/model/src/elements/Node.ts:615](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L615)

Resolve the given position in the document, returning an
[object](#model.ResolvedPos) with information about its context.

#### Parameters

| Parameter | Type     | Description              |
| --------- | -------- | ------------------------ |
| `pos`     | `number` | The position to resolve. |

#### Returns

[`ResolvedPos`](../../ResolvedPos/classes/ResolvedPos.md)

A ResolvedPos object with information about the position's context.

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`resolve`](../../Node/classes/Node.md#resolve)

---

### resolveNoCache()

```ts
resolveNoCache(pos): ResolvedPos;
```

Defined in: [packages/model/src/elements/Node.ts:625](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L625)

Resolve the given position without using the cache.

#### Parameters

| Parameter | Type     | Description              |
| --------- | -------- | ------------------------ |
| `pos`     | `number` | The position to resolve. |

#### Returns

[`ResolvedPos`](../../ResolvedPos/classes/ResolvedPos.md)

A ResolvedPos object with information about the position's context.

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`resolveNoCache`](../../Node/classes/Node.md#resolvenocache)

---

### sameMarkup()

```ts
sameMarkup(other): boolean;
```

Defined in: [packages/model/src/elements/Node.ts:411](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L411)

Compare the markup (type, attributes, and marks) of this node to
those of another. Returns `true` if both have the same markup.

#### Parameters

| Parameter | Type                                 | Description                      |
| --------- | ------------------------------------ | -------------------------------- |
| `other`   | [`Node`](../../Node/classes/Node.md) | The node to compare markup with. |

#### Returns

`boolean`

`true` if both nodes have the same markup, `false` otherwise.

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`sameMarkup`](../../Node/classes/Node.md#samemarkup)

---

### slice()

```ts
slice(
   from,
   to?,
   includeParents?): Slice;
```

Defined in: [packages/model/src/elements/Node.ts:514](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L514)

Cut out the part of the document between the given positions, and
return it as a `Slice` object.

#### Parameters

| Parameter        | Type      | Default value | Description                                                      |
| ---------------- | --------- | ------------- | ---------------------------------------------------------------- |
| `from`           | `number`  | `undefined`   | The starting position.                                           |
| `to`             | `number`  | `...`         | The ending position. Defaults to the end of the node's content.  |
| `includeParents` | `boolean` | `false`       | Whether to include parent nodes in the slice. Defaults to false. |

#### Returns

[`Slice`](../../Slice/classes/Slice.md)

A Slice object representing the content between the positions.

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`slice`](../../Node/classes/Node.md#slice)

---

### textBetween()

```ts
textBetween(from, to): string;
```

Defined in: [packages/model/src/elements/TextNode.ts:109](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/TextNode.ts#L109)

Get the text content between the given positions within this text node.

#### Parameters

| Parameter | Type     | Description                            |
| --------- | -------- | -------------------------------------- |
| `from`    | `number` | The starting position within the text. |
| `to`      | `number` | The ending position within the text.   |

#### Returns

`string`

The text content between the positions.

#### Overrides

[`Node`](../../Node/classes/Node.md).[`textBetween`](../../Node/classes/Node.md#textbetween)

---

### toJSON()

```ts
toJSON(): TextNodeJSON;
```

Defined in: [packages/model/src/elements/TextNode.ts:170](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/TextNode.ts#L170)

Return a JSON-serializable representation of this text node.

#### Returns

[`TextNodeJSON`](../../../types/elements/TextNodeJSON/interfaces/TextNodeJSON.md)

A JSON representation of this text node.

#### Overrides

[`Node`](../../Node/classes/Node.md).[`toJSON`](../../Node/classes/Node.md#tojson)

---

### toString()

```ts
toString(): string;
```

Defined in: [packages/model/src/elements/TextNode.ts:95](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/TextNode.ts#L95)

Return a string representation of this text node for debugging purposes.

#### Returns

`string`

A debug string representation of this node.

#### Overrides

[`Node`](../../Node/classes/Node.md).[`toString`](../../Node/classes/Node.md#tostring)

---

### withText()

```ts
withText(text): TextNode;
```

Defined in: [packages/model/src/elements/TextNode.ts:129](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/TextNode.ts#L129)

Create a copy of this text node with different text content.

#### Parameters

| Parameter | Type     | Description           |
| --------- | -------- | --------------------- |
| `text`    | `string` | The new text content. |

#### Returns

`TextNode`

A new text node with the specified text, or this node if text is unchanged.

---

### wrapMarks()

```ts
protected wrapMarks(marks, content): string;
```

Defined in: [packages/model/src/elements/Node.ts:832](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L832)

#### Parameters

| Parameter | Type                                            |
| --------- | ----------------------------------------------- |
| `marks`   | readonly [`Mark`](../../Mark/classes/Mark.md)[] |
| `content` | `string`                                        |

#### Returns

`string`

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`wrapMarks`](../../Node/classes/Node.md#wrapmarks)

---

### fromJSON()

```ts
static fromJSON(schema, json): Node;
```

Defined in: [packages/model/src/elements/Node.ts:257](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/Node.ts#L257)

Deserialize a node from its JSON representation.

Note: NodeJSON as an array is not supported and will throw an error. It is only for backward compatibility.

#### Parameters

| Parameter | Type                                                                                                                                                | Description                                   |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `schema`  | [`Schema`](../../../schema/Schema/classes/Schema.md)                                                                                                | The schema to use for deserializing the node. |
| `json`    | \| [`NodeJSON`](../../../types/elements/NodeJSON/interfaces/NodeJSON.md) \| [`NodeJSON`](../../../types/elements/NodeJSON/interfaces/NodeJSON.md)[] | The JSON object representing the node.        |

#### Returns

[`Node`](../../Node/classes/Node.md)

A new Node instance.

#### Throws

If the JSON is invalid or the node type doesn't exist in the schema.

#### Inherited from

[`Node`](../../Node/classes/Node.md).[`fromJSON`](../../Node/classes/Node.md#fromjson)
