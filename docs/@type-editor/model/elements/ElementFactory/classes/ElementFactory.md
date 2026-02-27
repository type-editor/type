[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/model](../../../README.md) / [elements/ElementFactory](../README.md) / ElementFactory

# Class: ElementFactory

Defined in: [packages/model/src/elements/ElementFactory.ts:17](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/ElementFactory.ts#L17)

## Constructors

### Constructor

```ts
new ElementFactory(): ElementFactory;
```

#### Returns

`ElementFactory`

## Properties

| Property                                      | Modifier   | Type                                            | Defined in                                                                                                                                                                              |
| --------------------------------------------- | ---------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-empty_mark"></a> `EMPTY_MARK` | `readonly` | readonly [`Mark`](../../Mark/classes/Mark.md)[] | [packages/model/src/elements/ElementFactory.ts:20](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/ElementFactory.ts#L20) |

## Accessors

### EMPTY_FRAGMENT

#### Get Signature

```ts
get static EMPTY_FRAGMENT(): Fragment;
```

Defined in: [packages/model/src/elements/ElementFactory.ts:26](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/ElementFactory.ts#L26)

##### Returns

[`Fragment`](../../Fragment/classes/Fragment.md)

---

### EMPTY_SLICE

#### Get Signature

```ts
get static EMPTY_SLICE(): Slice;
```

Defined in: [packages/model/src/elements/ElementFactory.ts:22](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/ElementFactory.ts#L22)

##### Returns

[`Slice`](../../Slice/classes/Slice.md)

## Methods

### createFragment()

```ts
static createFragment(content, size?): Fragment;
```

Defined in: [packages/model/src/elements/ElementFactory.ts:33](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/ElementFactory.ts#L33)

#### Parameters

| Parameter | Type                                            |
| --------- | ----------------------------------------------- |
| `content` | readonly [`Node`](../../Node/classes/Node.md)[] |
| `size?`   | `number`                                        |

#### Returns

[`Fragment`](../../Fragment/classes/Fragment.md)

---

### createMark()

```ts
static createMark(type, attrs): Mark;
```

Defined in: [packages/model/src/elements/ElementFactory.ts:193](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/ElementFactory.ts#L193)

#### Parameters

| Parameter | Type                                                         |
| --------- | ------------------------------------------------------------ |
| `type`    | [`MarkType`](../../../schema/MarkType/classes/MarkType.md)   |
| `attrs`   | [`Attrs`](../../../types/schema/Attrs/type-aliases/Attrs.md) |

#### Returns

[`Mark`](../../Mark/classes/Mark.md)

---

### createNode()

```ts
static createNode(
   type,
   attrs,
   content?,
   marks?,
   text?): Node;
```

Defined in: [packages/model/src/elements/ElementFactory.ts:170](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/ElementFactory.ts#L170)

#### Parameters

| Parameter  | Type                                                         |
| ---------- | ------------------------------------------------------------ |
| `type`     | [`NodeType`](../../../schema/NodeType/classes/NodeType.md)   |
| `attrs`    | [`Attrs`](../../../types/schema/Attrs/type-aliases/Attrs.md) |
| `content?` | [`Fragment`](../../Fragment/classes/Fragment.md)             |
| `marks?`   | readonly [`Mark`](../../Mark/classes/Mark.md)[]              |
| `text?`    | `string`                                                     |

#### Returns

[`Node`](../../Node/classes/Node.md)

---

### createNodeRange()

```ts
static createNodeRange(
   $from,
   $to,
   depth): NodeRange;
```

Defined in: [packages/model/src/elements/ElementFactory.ts:166](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/ElementFactory.ts#L166)

#### Parameters

| Parameter | Type                                                      |
| --------- | --------------------------------------------------------- |
| `$from`   | [`ResolvedPos`](../../ResolvedPos/classes/ResolvedPos.md) |
| `$to`     | [`ResolvedPos`](../../ResolvedPos/classes/ResolvedPos.md) |
| `depth`   | `number`                                                  |

#### Returns

[`NodeRange`](../../NodeRange/classes/NodeRange.md)

---

### createSlice()

```ts
static createSlice(
   content,
   openStart,
   openEnd): Slice;
```

Defined in: [packages/model/src/elements/ElementFactory.ts:150](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/ElementFactory.ts#L150)

#### Parameters

| Parameter   | Type                                             |
| ----------- | ------------------------------------------------ |
| `content`   | [`Fragment`](../../Fragment/classes/Fragment.md) |
| `openStart` | `number`                                         |
| `openEnd`   | `number`                                         |

#### Returns

[`Slice`](../../Slice/classes/Slice.md)

---

### createTextNode()

```ts
static createTextNode(
   type,
   attrs,
   content,
   marks?): TextNode;
```

Defined in: [packages/model/src/elements/ElementFactory.ts:178](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/ElementFactory.ts#L178)

#### Parameters

| Parameter | Type                                                         |
| --------- | ------------------------------------------------------------ |
| `type`    | [`NodeType`](../../../schema/NodeType/classes/NodeType.md)   |
| `attrs`   | [`Attrs`](../../../types/schema/Attrs/type-aliases/Attrs.md) |
| `content` | `string`                                                     |
| `marks?`  | readonly [`Mark`](../../Mark/classes/Mark.md)[]              |

#### Returns

[`TextNode`](../../TextNode/classes/TextNode.md)

---

### fragmentFromJSON()

```ts
static fragmentFromJSON(schema, value?): Fragment;
```

Defined in: [packages/model/src/elements/ElementFactory.ts:37](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/ElementFactory.ts#L37)

#### Parameters

| Parameter | Type                                                                    |
| --------- | ----------------------------------------------------------------------- |
| `schema`  | [`Schema`](../../../schema/Schema/classes/Schema.md)                    |
| `value?`  | [`NodeJSON`](../../../types/elements/NodeJSON/interfaces/NodeJSON.md)[] |

#### Returns

[`Fragment`](../../Fragment/classes/Fragment.md)

---

### from()

```ts
static from(nodes?): Fragment;
```

Defined in: [packages/model/src/elements/ElementFactory.ts:68](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/ElementFactory.ts#L68)

Creates a fragment from various input types that can be interpreted as a set of nodes.

This is a convenience method that handles multiple input types:

- `null` or `undefined`: Returns Fragment.EMPTY
- `Fragment`: Returns the fragment itself (identity operation, no copy made)
- `Node`: Returns a fragment containing that single node
- `Array<Node>`: Returns a fragment containing those nodes (with text nodes merged)

This method is particularly useful when you need to accept flexible input types
in your API, as it normalizes them all to Fragment instances.

#### Parameters

| Parameter | Type                                                                                                                                           | Description                                                                                                  |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `nodes?`  | \| [`Fragment`](../../Fragment/classes/Fragment.md) \| [`Node`](../../Node/classes/Node.md) \| readonly [`Node`](../../Node/classes/Node.md)[] | The input to convert to a fragment. Can be null, undefined, a Fragment, a single Node, or an array of Nodes. |

#### Returns

[`Fragment`](../../Fragment/classes/Fragment.md)

A Fragment instance representing the input.

#### Throws

If the input cannot be converted to a Fragment. Also provides
a helpful hint if multiple versions of prosemirror-model are detected.

#### Example

```typescript
// All these are valid:
const frag1 = Fragment.from(null); // Fragment.EMPTY
const frag2 = Fragment.from(existingFrag); // Same fragment
const frag3 = Fragment.from(singleNode); // Fragment with one node
const frag4 = Fragment.from([node1, node2]); // Fragment with multiple nodes
```

---

### fromArray()

```ts
static fromArray(array): Fragment;
```

Defined in: [packages/model/src/elements/ElementFactory.ts:119](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/ElementFactory.ts#L119)

Builds a fragment from an array of nodes. Automatically merges adjacent
text nodes that have the same markup (marks) into single text nodes.

This method is more efficient than creating a fragment and then calling
append() multiple times, as it performs text node merging in a single pass.
Empty arrays return Fragment.EMPTY for efficiency.

#### Parameters

| Parameter | Type                                            | Description                                                                                           |
| --------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `array`   | readonly [`Node`](../../Node/classes/Node.md)[] | The array of nodes to create a fragment from. Can be empty, in which case Fragment.EMPTY is returned. |

#### Returns

[`Fragment`](../../Fragment/classes/Fragment.md)

A new Fragment instance with adjacent text nodes merged where possible.

#### Example

```typescript
// Text nodes with same marks will be merged
const text1 = schema.text("Hello", [boldMark]);
const text2 = schema.text(" world", [boldMark]);
const fragment = Fragment.fromArray([text1, text2]);
// Results in single text node: "Hello world" with bold mark

// Different marks - no merging
const text3 = schema.text("!", [italicMark]);
const fragment2 = Fragment.fromArray([text1, text2, text3]);
// Results in two nodes: "Hello world" (bold) and "!" (italic)
```

---

### isMark()

```ts
static isMark(markOrMarkType): boolean;
```

Defined in: [packages/model/src/elements/ElementFactory.ts:205](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/ElementFactory.ts#L205)

#### Parameters

| Parameter        | Type                                                                                                  |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| `markOrMarkType` | \| [`Mark`](../../Mark/classes/Mark.md) \| [`MarkType`](../../../schema/MarkType/classes/MarkType.md) |

#### Returns

`boolean`

---

### isSlice()

```ts
static isSlice(node): boolean;
```

Defined in: [packages/model/src/elements/ElementFactory.ts:162](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/ElementFactory.ts#L162)

#### Parameters

| Parameter | Type                                                                               |
| --------- | ---------------------------------------------------------------------------------- |
| `node`    | \| [`Node`](../../Node/classes/Node.md) \| [`Slice`](../../Slice/classes/Slice.md) |

#### Returns

`boolean`

---

### markFromJSON()

```ts
static markFromJSON(schema, json): Mark;
```

Defined in: [packages/model/src/elements/ElementFactory.ts:209](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/ElementFactory.ts#L209)

#### Parameters

| Parameter | Type                                                                  |
| --------- | --------------------------------------------------------------------- |
| `schema`  | [`Schema`](../../../schema/Schema/classes/Schema.md)                  |
| `json`    | [`MarkJSON`](../../../types/elements/MarkJSON/interfaces/MarkJSON.md) |

#### Returns

[`Mark`](../../Mark/classes/Mark.md)

---

### maxOpen()

```ts
static maxOpen(fragment, openIsolating?): Slice;
```

Defined in: [packages/model/src/elements/ElementFactory.ts:154](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/ElementFactory.ts#L154)

#### Parameters

| Parameter       | Type                                             | Default value |
| --------------- | ------------------------------------------------ | ------------- |
| `fragment`      | [`Fragment`](../../Fragment/classes/Fragment.md) | `undefined`   |
| `openIsolating` | `boolean`                                        | `true`        |

#### Returns

[`Slice`](../../Slice/classes/Slice.md)

---

### nodeFromJSON()

```ts
static nodeFromJSON(schema, json): Node;
```

Defined in: [packages/model/src/elements/ElementFactory.ts:185](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/ElementFactory.ts#L185)

#### Parameters

| Parameter | Type                                                                  |
| --------- | --------------------------------------------------------------------- |
| `schema`  | [`Schema`](../../../schema/Schema/classes/Schema.md)                  |
| `json`    | [`NodeJSON`](../../../types/elements/NodeJSON/interfaces/NodeJSON.md) |

#### Returns

[`Node`](../../Node/classes/Node.md)

---

### sameSet()

```ts
static sameSet(a, b): boolean;
```

Defined in: [packages/model/src/elements/ElementFactory.ts:201](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/ElementFactory.ts#L201)

#### Parameters

| Parameter | Type                                            |
| --------- | ----------------------------------------------- |
| `a`       | readonly [`Mark`](../../Mark/classes/Mark.md)[] |
| `b`       | readonly [`Mark`](../../Mark/classes/Mark.md)[] |

#### Returns

`boolean`

---

### setFrom()

```ts
static setFrom(marks?): readonly Mark[];
```

Defined in: [packages/model/src/elements/ElementFactory.ts:197](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/ElementFactory.ts#L197)

#### Parameters

| Parameter | Type                                                                                       |
| --------- | ------------------------------------------------------------------------------------------ |
| `marks?`  | \| [`Mark`](../../Mark/classes/Mark.md) \| readonly [`Mark`](../../Mark/classes/Mark.md)[] |

#### Returns

readonly [`Mark`](../../Mark/classes/Mark.md)[]

---

### sliceFromJSON()

```ts
static sliceFromJSON(schema, json): Slice;
```

Defined in: [packages/model/src/elements/ElementFactory.ts:158](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/ElementFactory.ts#L158)

#### Parameters

| Parameter | Type                                                                     |
| --------- | ------------------------------------------------------------------------ |
| `schema`  | [`Schema`](../../../schema/Schema/classes/Schema.md)                     |
| `json`    | [`SliceJSON`](../../../types/elements/SliceJSON/interfaces/SliceJSON.md) |

#### Returns

[`Slice`](../../Slice/classes/Slice.md)

---

### textNodeFromJSON()

```ts
static textNodeFromJSON(schema, json): Node;
```

Defined in: [packages/model/src/elements/ElementFactory.ts:189](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/ElementFactory.ts#L189)

#### Parameters

| Parameter | Type                                                                  |
| --------- | --------------------------------------------------------------------- |
| `schema`  | [`Schema`](../../../schema/Schema/classes/Schema.md)                  |
| `json`    | [`NodeJSON`](../../../types/elements/NodeJSON/interfaces/NodeJSON.md) |

#### Returns

[`Node`](../../Node/classes/Node.md)
