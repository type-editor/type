[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/model](../../../README.md) / [dom-parser/DOMSerializer](../README.md) / DOMSerializer

# Class: DOMSerializer

Defined in: [packages/model/src/dom-parser/DOMSerializer.ts:18](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/dom-parser/DOMSerializer.ts#L18)

A DOM serializer knows how to convert ProseMirror nodes and
marks of various types to DOM nodes.

## Constructors

### Constructor

```ts
new DOMSerializer(nodes, marks): DOMSerializer;
```

Defined in: [packages/model/src/dom-parser/DOMSerializer.ts:38](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/dom-parser/DOMSerializer.ts#L38)

Create a serializer. `nodes` should map node names to functions
that take a node and return a description of the corresponding
DOM. `marks` does the same for mark names, but also gets an
argument that tells it whether the mark's content is block or
inline content (for typical use, it'll always be inline). A mark
serializer may be `null` to indicate that marks of that type
should not be serialized.

#### Parameters

| Parameter | Type                                                                                                                                     | Description                       |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `nodes`   | `Record`&lt;`string`, (`node`) => [`DOMOutputSpec`](../../../types/dom-parser/DOMOutputSpec/type-aliases/DOMOutputSpec.md)&gt;           | The node serialization functions. |
| `marks`   | `Record`&lt;`string`, (`mark`, `inline`) => [`DOMOutputSpec`](../../../types/dom-parser/DOMOutputSpec/type-aliases/DOMOutputSpec.md)&gt; | The mark serialization functions. |

#### Returns

`DOMSerializer`

## Accessors

### marks

#### Get Signature

```ts
get marks(): Record<string, (mark, inline) => DOMOutputSpec>;
```

Defined in: [packages/model/src/dom-parser/DOMSerializer.ts:48](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/dom-parser/DOMSerializer.ts#L48)

##### Returns

`Record`&lt;`string`, (`mark`, `inline`) => [`DOMOutputSpec`](../../../types/dom-parser/DOMOutputSpec/type-aliases/DOMOutputSpec.md)&gt;

---

### nodes

#### Get Signature

```ts
get nodes(): Record<string, (node) => DOMOutputSpec>;
```

Defined in: [packages/model/src/dom-parser/DOMSerializer.ts:44](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/dom-parser/DOMSerializer.ts#L44)

##### Returns

`Record`&lt;`string`, (`node`) => [`DOMOutputSpec`](../../../types/dom-parser/DOMOutputSpec/type-aliases/DOMOutputSpec.md)&gt;

## Methods

### serializeFragment()

```ts
serializeFragment(
   fragment,
   options?,
   target?): HTMLElement | DocumentFragment;
```

Defined in: [packages/model/src/dom-parser/DOMSerializer.ts:300](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/dom-parser/DOMSerializer.ts#L300)

Serialize the content of this selfPos to a DOM selfPos. When
not in the browser, the `document` option, containing a DOM
document, should be passed so that the serializer can create
nodes.

#### Parameters

| Parameter           | Type                                                         |
| ------------------- | ------------------------------------------------------------ |
| `fragment`          | [`Fragment`](../../../elements/Fragment/classes/Fragment.md) |
| `options`           | \{ `document?`: `Document`; \}                               |
| `options.document?` | `Document`                                                   |
| `target?`           | `HTMLElement` \| `DocumentFragment`                          |

#### Returns

`HTMLElement` \| `DocumentFragment`

---

### serializeNode()

```ts
serializeNode(node, options?): Node;
```

Defined in: [packages/model/src/dom-parser/DOMSerializer.ts:360](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/dom-parser/DOMSerializer.ts#L360)

Serialize this node to a DOM node. This can be useful when you
need to serialize a part of a document, as opposed to the whole
document. To serialize a whole document, use
[`serializeFragment`](#model.DOMSerializer.serializeFragment) on
its [content](#model.Node.content).

#### Parameters

| Parameter           | Type                                             |
| ------------------- | ------------------------------------------------ |
| `node`              | [`Node`](../../../elements/Node/classes/Node.md) |
| `options`           | \{ `document?`: `Document`; \}                   |
| `options.document?` | `Document`                                       |

#### Returns

`Node`

---

### fromSchema()

```ts
static fromSchema(schema): DOMSerializer;
```

Defined in: [packages/model/src/dom-parser/DOMSerializer.ts:78](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/dom-parser/DOMSerializer.ts#L78)

Build a serializer using the [`toDOM`](#model.NodeSpec.toDOM)
properties in a schema's node and mark specs.

#### Parameters

| Parameter | Type                                                 |
| --------- | ---------------------------------------------------- |
| `schema`  | [`Schema`](../../../schema/Schema/classes/Schema.md) |

#### Returns

`DOMSerializer`

---

### renderSpec()

```ts
static renderSpec(
   doc,
   structure,
   xmlNS?): {
  contentDOM?: HTMLElement;
  dom: Node;
};
```

Defined in: [packages/model/src/dom-parser/DOMSerializer.ts:60](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/dom-parser/DOMSerializer.ts#L60)

Render an [output spec](#model.DOMOutputSpec) to a DOM node. If
the spec has a hole (zero) in it, `contentDOM` will point at the
node with the hole.

#### Parameters

| Parameter   | Type                                                                                     |
| ----------- | ---------------------------------------------------------------------------------------- |
| `doc`       | `Document`                                                                               |
| `structure` | [`DOMOutputSpec`](../../../types/dom-parser/DOMOutputSpec/type-aliases/DOMOutputSpec.md) |
| `xmlNS?`    | `string`                                                                                 |

#### Returns

```ts
{
  contentDOM?: HTMLElement;
  dom: Node;
}
```

| Name          | Type          | Defined in                                                                                                                                                                                |
| ------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `contentDOM?` | `HTMLElement` | [packages/model/src/dom-parser/DOMSerializer.ts:62](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/dom-parser/DOMSerializer.ts#L62) |
| `dom`         | `Node`        | [packages/model/src/dom-parser/DOMSerializer.ts:61](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/dom-parser/DOMSerializer.ts#L61) |
