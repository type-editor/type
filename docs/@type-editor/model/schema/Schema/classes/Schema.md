[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/model](../../../README.md) / [schema/Schema](../README.md) / Schema

# Class: Schema&lt;Nodes, Marks&gt;

Defined in: [packages/model/src/schema/Schema.ts:28](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/Schema.ts#L28)

A document schema. Holds [node](#model.NodeType) and [mark
type](#model.MarkType) objects for the nodes and marks that may
occur in conforming documents, and provides functionality for
creating and deserializing such documents.

When given, the type parameters provide the names of the nodes and
marks in this schema.

## Type Parameters

| Type Parameter             | Default type |
| -------------------------- | ------------ |
| `Nodes` _extends_ `string` | `string`     |
| `Marks` _extends_ `string` | `string`     |

## Constructors

### Constructor

```ts
new Schema<Nodes, Marks>(spec): Schema<Nodes, Marks>;
```

Defined in: [packages/model/src/schema/Schema.ts:90](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/Schema.ts#L90)

Constructs a schema from a schema specification.
Compiles node and mark types, validates the schema structure, and initializes
content matching and mark restrictions.

#### Parameters

| Parameter | Type                                                                                              | Description                                                   |
| --------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `spec`    | [`SchemaSpec`](../../../types/schema/SchemaSpec/interfaces/SchemaSpec.md)&lt;`Nodes`, `Marks`&gt; | The schema specification containing node and mark definitions |

#### Returns

`Schema`&lt;`Nodes`, `Marks`&gt;

#### Throws

If the schema is invalid (e.g., duplicate node/mark names,
multiple linebreak nodes, invalid linebreak node configuration)

## Accessors

### cached

#### Get Signature

```ts
get cached(): Record<string, any>;
```

Defined in: [packages/model/src/schema/Schema.ts:165](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/Schema.ts#L165)

An object for storing cached values computed from the schema.
Modules can use this to cache expensive computations. Use unique
property names to avoid conflicts.

##### Returns

`Record`&lt;`string`, `any`&gt;

---

### linebreakReplacement

#### Get Signature

```ts
get linebreakReplacement(): NodeType;
```

Defined in: [packages/model/src/schema/Schema.ts:148](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/Schema.ts#L148)

The linebreak replacement node type, if one is defined in this schema.
This node type is used to replace newline characters in pasted content.

##### Returns

[`NodeType`](../../NodeType/classes/NodeType.md)

---

### markFromJSON

#### Get Signature

```ts
get markFromJSON(): (json) => Mark;
```

Defined in: [packages/model/src/schema/Schema.ts:183](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/Schema.ts#L183)

Deserialize a mark from its JSON representation. This method is
bound.

##### Returns

```ts
(json): Mark;
```

###### Parameters

| Parameter | Type                                                                  |
| --------- | --------------------------------------------------------------------- |
| `json`    | [`MarkJSON`](../../../types/elements/MarkJSON/interfaces/MarkJSON.md) |

###### Returns

[`Mark`](../../../elements/Mark/classes/Mark.md)

---

### marks

#### Get Signature

```ts
get marks(): Readonly<Record<Marks, MarkType>> & Readonly<Record<string, MarkType>>;
```

Defined in: [packages/model/src/schema/Schema.ts:140](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/Schema.ts#L140)

An object mapping mark names to MarkType instances.
Contains all mark types defined in this schema.

##### Returns

`Readonly`&lt;`Record`&lt;`Marks`, [`MarkType`](../../MarkType/classes/MarkType.md)&gt;&gt; & `Readonly`&lt;`Record`&lt;`string`, [`MarkType`](../../MarkType/classes/MarkType.md)&gt;&gt;

---

### nodeFromJSON

#### Get Signature

```ts
get nodeFromJSON(): (json) => Node;
```

Defined in: [packages/model/src/schema/Schema.ts:175](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/Schema.ts#L175)

Deserialize a node from its JSON representation. This method is
bound.

NodeJSON as array for backwards compatibility

##### Returns

```ts
(json): Node;
```

###### Parameters

| Parameter | Type                                                                                                                                                |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `json`    | \| [`NodeJSON`](../../../types/elements/NodeJSON/interfaces/NodeJSON.md) \| [`NodeJSON`](../../../types/elements/NodeJSON/interfaces/NodeJSON.md)[] |

###### Returns

[`Node`](../../../elements/Node/classes/Node.md)

---

### nodes

#### Get Signature

```ts
get nodes(): Readonly<Record<Nodes, NodeType>> & Readonly<Record<string, NodeType>>;
```

Defined in: [packages/model/src/schema/Schema.ts:132](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/Schema.ts#L132)

An object mapping node names to NodeType instances.
Contains all node types defined in this schema.

##### Returns

`Readonly`&lt;`Record`&lt;`Nodes`, [`NodeType`](../../NodeType/classes/NodeType.md)&gt;&gt; & `Readonly`&lt;`Record`&lt;`string`, [`NodeType`](../../NodeType/classes/NodeType.md)&gt;&gt;

---

### spec

#### Get Signature

```ts
get spec(): BasicSchemaSpec<NodeSpec, MarkSpec>;
```

Defined in: [packages/model/src/schema/Schema.ts:124](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/Schema.ts#L124)

The schema specification this schema is based on, with nodes and marks
converted to OrderedMap instances for consistent ordering.

##### Returns

[`BasicSchemaSpec`](../../../types/schema/BasicSchemaSpec/interfaces/BasicSchemaSpec.md)&lt;[`NodeSpec`](../../../types/schema/NodeSpec/interfaces/NodeSpec.md), [`MarkSpec`](../../../types/schema/MarkSpec/interfaces/MarkSpec.md)&gt;

---

### topNodeType

#### Get Signature

```ts
get topNodeType(): NodeType;
```

Defined in: [packages/model/src/schema/Schema.ts:156](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/Schema.ts#L156)

The top-level node type for this schema (defaults to 'doc').
This is the root node type that contains the document content.

##### Returns

[`NodeType`](../../NodeType/classes/NodeType.md)

## Methods

### mark()

```ts
mark(type, attrs?): Mark;
```

Defined in: [packages/model/src/schema/Schema.ts:236](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/Schema.ts#L236)

Create a mark with the given type and attributes.

#### Parameters

| Parameter | Type                                                         | Description                                                 |
| --------- | ------------------------------------------------------------ | ----------------------------------------------------------- |
| `type`    | `string` \| [`MarkType`](../../MarkType/classes/MarkType.md) | The mark type name or MarkType instance                     |
| `attrs?`  | [`Attrs`](../../../types/schema/Attrs/type-aliases/Attrs.md) | Attribute values for the mark, or undefined to use defaults |

#### Returns

[`Mark`](../../../elements/Mark/classes/Mark.md)

A new Mark instance

#### Throws

If the mark type is not found in this schema

---

### node()

```ts
node(
   type,
   attrs?,
   content?,
   marks?): Node;
```

Defined in: [packages/model/src/schema/Schema.ts:200](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/Schema.ts#L200)

Create a node in this schema. The `type` may be a string or a
`NodeType` instance. Attributes will be extended with defaults,
`content` may be a `Fragment`, `null`, a `Node`, or an array of
nodes.

#### Parameters

| Parameter  | Type                                                                                                                                                                               | Default value | Description                                                           |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | --------------------------------------------------------------------- |
| `type`     | `string` \| [`NodeType`](../../NodeType/classes/NodeType.md)                                                                                                                       | `undefined`   | The node type name or NodeType instance                               |
| `attrs`    | `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt;                                                                                                                                  | `null`        | Attribute values for the node, or null to use defaults                |
| `content?` | \| [`Fragment`](../../../elements/Fragment/classes/Fragment.md) \| [`Node`](../../../elements/Node/classes/Node.md) \| readonly [`Node`](../../../elements/Node/classes/Node.md)[] | `undefined`   | Fragment, single node, array of nodes, or undefined for empty content |
| `marks?`   | readonly [`Mark`](../../../elements/Mark/classes/Mark.md)[]                                                                                                                        | `undefined`   | Array of marks to apply to the node, or undefined for no marks        |

#### Returns

[`Node`](../../../elements/Node/classes/Node.md)

A new Node instance

#### Throws

If the type is invalid or from a different schema

---

### nodeType()

```ts
nodeType(name): NodeType;
```

Defined in: [packages/model/src/schema/Schema.ts:254](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/Schema.ts#L254)

Retrieves a node type by name.

#### Parameters

| Parameter | Type     | Description                           |
| --------- | -------- | ------------------------------------- |
| `name`    | `string` | The name of the node type to retrieve |

#### Returns

[`NodeType`](../../NodeType/classes/NodeType.md)

The NodeType instance

#### Throws

If the node type is not found in this schema

---

### text()

```ts
text(text, marks?): Node;
```

Defined in: [packages/model/src/schema/Schema.ts:223](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/Schema.ts#L223)

Create a text node in this schema. Empty text nodes are not
allowed.

#### Parameters

| Parameter | Type                                                        | Description                                                         |
| --------- | ----------------------------------------------------------- | ------------------------------------------------------------------- |
| `text`    | `string`                                                    | The text content for the node                                       |
| `marks?`  | readonly [`Mark`](../../../elements/Mark/classes/Mark.md)[] | Array of marks to apply to the text node, or undefined for no marks |

#### Returns

[`Node`](../../../elements/Node/classes/Node.md)

A new text Node instance
