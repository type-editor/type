[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/markdown](../../../README.md) / [to-markdown/MarkdownSerializer](../README.md) / MarkdownSerializer

# Class: MarkdownSerializer

Defined in: [to-markdown/MarkdownSerializer.ts:12](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/markdown/src/to-markdown/MarkdownSerializer.ts#L12)

A specification for serializing a ProseMirror document as
Markdown/CommonMark text.

## Constructors

### Constructor

```ts
new MarkdownSerializer(
   nodes,
   marks,
   options?): MarkdownSerializer;
```

Defined in: [to-markdown/MarkdownSerializer.ts:28](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/markdown/src/to-markdown/MarkdownSerializer.ts#L28)

Construct a serializer with the given configuration. The `nodes`
object should map node names in a given schema to functions that
take a serializer state and such a node, and serialize the node.

#### Parameters

| Parameter  | Type                                                                                                                   | Description                                                         |
| ---------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `nodes`    | `Record`&lt;`string`, [`NodeSerializerFunc`](../../../types/NodeSerializerFunc/type-aliases/NodeSerializerFunc.md)&gt; | A record mapping node type names to their serializer functions      |
| `marks`    | `Record`&lt;`string`, [`MarkSerializerSpec`](../../../types/MarkSerializerSpec/interfaces/MarkSerializerSpec.md)&gt;   | A record mapping mark type names to their serializer specifications |
| `options?` | [`MarkdownSerializerOptions`](../../../types/MarkdownSerializerOptions/interfaces/MarkdownSerializerOptions.md)        | Optional configuration for the serializer behavior                  |

#### Returns

`MarkdownSerializer`

## Properties

| Property                              | Modifier   | Type                                                                                                                   | Defined in                                                                                                                                                                            |
| ------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-_nodes"></a> `_nodes` | `readonly` | `Record`&lt;`string`, [`NodeSerializerFunc`](../../../types/NodeSerializerFunc/type-aliases/NodeSerializerFunc.md)&gt; | [to-markdown/MarkdownSerializer.ts:14](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/markdown/src/to-markdown/MarkdownSerializer.ts#L14) |

## Accessors

### marks

#### Get Signature

```ts
get marks(): Record<string, MarkSerializerSpec>;
```

Defined in: [to-markdown/MarkdownSerializer.ts:41](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/markdown/src/to-markdown/MarkdownSerializer.ts#L41)

##### Returns

`Record`&lt;`string`, [`MarkSerializerSpec`](../../../types/MarkSerializerSpec/interfaces/MarkSerializerSpec.md)&gt;

---

### nodes

#### Get Signature

```ts
get nodes(): Record<string, NodeSerializerFunc>;
```

Defined in: [to-markdown/MarkdownSerializer.ts:37](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/markdown/src/to-markdown/MarkdownSerializer.ts#L37)

##### Returns

`Record`&lt;`string`, [`NodeSerializerFunc`](../../../types/NodeSerializerFunc/type-aliases/NodeSerializerFunc.md)&gt;

---

### options

#### Get Signature

```ts
get options(): MarkdownSerializerOptions;
```

Defined in: [to-markdown/MarkdownSerializer.ts:45](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/markdown/src/to-markdown/MarkdownSerializer.ts#L45)

##### Returns

[`MarkdownSerializerOptions`](../../../types/MarkdownSerializerOptions/interfaces/MarkdownSerializerOptions.md)

## Methods

### serialize()

```ts
serialize(content, tightLists?): string;
```

Defined in: [to-markdown/MarkdownSerializer.ts:57](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/markdown/src/to-markdown/MarkdownSerializer.ts#L57)

Serialize the content of the given node to
[CommonMark](http://commonmark.org/).

#### Parameters

| Parameter    | Type      | Default value | Description                                                           |
| ------------ | --------- | ------------- | --------------------------------------------------------------------- |
| `content`    | `Node_2`  | `undefined`   | The ProseMirror node to serialize to Markdown                         |
| `tightLists` | `boolean` | `false`       | Whether to render lists in tight style (no blank lines between items) |

#### Returns

`string`

The serialized Markdown string
