[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/model](../../../README.md) / [schema/NodeType](../README.md) / NodeType

# Class: NodeType

Defined in: [packages/model/src/schema/NodeType.ts:23](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L23)

Node types are objects allocated once per `Schema` and used to
[tag](#model.Node.type) `Node` instances. They contain information
about the node type, such as its name and what kind of node it
represents.

## Extends

- [`TypeBase`](../../TypeBase/classes/TypeBase.md)

## Constructors

### Constructor

```ts
new NodeType(
   name,
   schema,
   spec): NodeType;
```

Defined in: [packages/model/src/schema/NodeType.ts:82](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L82)

Creates a new NodeType instance.

#### Parameters

| Parameter | Type                                                                | Description                                        |
| --------- | ------------------------------------------------------------------- | -------------------------------------------------- |
| `name`    | `string`                                                            | The name the node type has in this schema          |
| `schema`  | [`Schema`](../../Schema/classes/Schema.md)                          | A link back to the Schema the node type belongs to |
| `spec`    | [`NodeSpec`](../../../types/schema/NodeSpec/interfaces/NodeSpec.md) | The specification that this type is based on       |

#### Returns

`NodeType`

#### Overrides

[`TypeBase`](../../TypeBase/classes/TypeBase.md).[`constructor`](../../TypeBase/classes/TypeBase.md#constructor)

## Properties

| Property                                                            | Modifier    | Type                                                                                    | Default value | Description                                               | Inherited from                                                                                                | Defined in                                                                                                                                                              |
| ------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------- | ------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-_contentmatch"></a> `_contentMatch`                 | `protected` | [`ContentMatch`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md) | `undefined`   | The starting match of the node type's content expression. | -                                                                                                             | [packages/model/src/schema/NodeType.ts:30](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L30) |
| <a id="property-attrs"></a> `attrs`                                 | `readonly`  | `Record`&lt;`string`, [`Attribute`](../../Attribute/classes/Attribute.md)&gt;           | `undefined`   | -                                                         | [`TypeBase`](../../TypeBase/classes/TypeBase.md).[`attrs`](../../TypeBase/classes/TypeBase.md#property-attrs) | [packages/model/src/schema/TypeBase.ts:16](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/TypeBase.ts#L16) |
| <a id="property-isinlinecontent"></a> `isInlineContent`             | `protected` | `boolean`                                                                               | `false`       | True if this node type has inline content.                | -                                                                                                             | [packages/model/src/schema/NodeType.ts:34](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L34) |
| <a id="property-elements_id_attr_name"></a> `ELEMENTS_ID_ATTR_NAME` | `readonly`  | `"id"`                                                                                  | `'id'`        | -                                                         | -                                                                                                             | [packages/model/src/schema/NodeType.ts:25](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L25) |

## Accessors

### attributeSpecs

#### Get Signature

```ts
get attributeSpecs(): Record<string, Attribute>;
```

Defined in: [packages/model/src/schema/NodeType.ts:160](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L160)

The attribute specifications for this node type.
Contains metadata about each attribute including validation and comparison behavior.

##### Returns

`Record`&lt;`string`, [`Attribute`](../../Attribute/classes/Attribute.md)&gt;

---

### contentMatch

#### Get Signature

```ts
get contentMatch(): ContentMatch;
```

Defined in: [packages/model/src/schema/NodeType.ts:119](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L119)

The starting match of the node type's content expression.
Used to validate and match content during node operations.

##### Returns

[`ContentMatch`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md)

#### Set Signature

```ts
set contentMatch(value): void;
```

Defined in: [packages/model/src/schema/NodeType.ts:127](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L127)

Sets the content match for this node type.

##### Parameters

| Parameter | Type                                                                                    | Description                      |
| --------- | --------------------------------------------------------------------------------------- | -------------------------------- |
| `value`   | [`ContentMatch`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md) | The ContentMatch instance to set |

##### Returns

`void`

---

### defaultAttrs

#### Get Signature

```ts
get defaultAttrs(): Attrs;
```

Defined in: [packages/model/src/schema/NodeType.ts:152](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L152)

The default attributes for this node type.
When creating nodes without specifying attributes, these defaults are used.

##### Returns

[`Attrs`](../../../types/schema/Attrs/type-aliases/Attrs.md)

---

### inlineContent

#### Get Signature

```ts
get inlineContent(): boolean;
```

Defined in: [packages/model/src/schema/NodeType.ts:167](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L167)

True if this node type has inline content.

##### Returns

`boolean`

#### Set Signature

```ts
set inlineContent(value): void;
```

Defined in: [packages/model/src/schema/NodeType.ts:175](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L175)

Sets whether this node type has inline content.

##### Parameters

| Parameter | Type      | Description                                 |
| --------- | --------- | ------------------------------------------- |
| `value`   | `boolean` | True if the node should have inline content |

##### Returns

`void`

---

### isAtom

#### Get Signature

```ts
get isAtom(): boolean;
```

Defined in: [packages/model/src/schema/NodeType.ts:218](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L218)

True when this node is an atom, i.e. when it does not have
directly editable content.

##### Returns

`boolean`

---

### isBlock

#### Get Signature

```ts
get isBlock(): boolean;
```

Defined in: [packages/model/src/schema/NodeType.ts:196](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L196)

True if this is a block type (not inline).

##### Returns

`boolean`

---

### isInline

#### Get Signature

```ts
get isInline(): boolean;
```

Defined in: [packages/model/src/schema/NodeType.ts:182](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L182)

True if this is an inline type.

##### Returns

`boolean`

---

### isLeaf

#### Get Signature

```ts
get isLeaf(): boolean;
```

Defined in: [packages/model/src/schema/NodeType.ts:210](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L210)

True for node types that allow no content.

##### Returns

`boolean`

---

### isText

#### Get Signature

```ts
get isText(): boolean;
```

Defined in: [packages/model/src/schema/NodeType.ts:203](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L203)

True if this is the text node type.

##### Returns

`boolean`

---

### isTextblock

#### Get Signature

```ts
get isTextblock(): boolean;
```

Defined in: [packages/model/src/schema/NodeType.ts:189](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L189)

True if this is a textblock type, a block that contains inline content.

##### Returns

`boolean`

---

### markSet

#### Get Signature

```ts
get markSet(): readonly MarkType[];
```

Defined in: [packages/model/src/schema/NodeType.ts:136](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L136)

The set of marks allowed in this node.
`null` means all marks are allowed, an empty array means no marks are allowed,
and a populated array restricts marks to the specified types.

##### Returns

readonly [`MarkType`](../../MarkType/classes/MarkType.md)[]

#### Set Signature

```ts
set markSet(value): void;
```

Defined in: [packages/model/src/schema/NodeType.ts:144](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L144)

Sets the mark restrictions for this node type.

##### Parameters

| Parameter | Type                                                        | Description                                                                      |
| --------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `value`   | readonly [`MarkType`](../../MarkType/classes/MarkType.md)[] | The array of allowed mark types, null for all marks, or empty array for no marks |

##### Returns

`void`

---

### name

#### Get Signature

```ts
get name(): string;
```

Defined in: [packages/model/src/schema/NodeType.ts:97](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L97)

The name of this node type.

##### Returns

`string`

---

### schema

#### Get Signature

```ts
get schema(): Schema;
```

Defined in: [packages/model/src/schema/NodeType.ts:104](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L104)

The schema that this node type is part of.

##### Returns

[`Schema`](../../Schema/classes/Schema.md)

---

### spec

#### Get Signature

```ts
get spec(): NodeSpec;
```

Defined in: [packages/model/src/schema/NodeType.ts:111](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L111)

The spec that this node type is based on.

##### Returns

[`NodeSpec`](../../../types/schema/NodeSpec/interfaces/NodeSpec.md)

---

### whitespace

#### Get Signature

```ts
get whitespace(): "pre" | "normal";
```

Defined in: [packages/model/src/schema/NodeType.ts:226](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L226)

The node type's [whitespace](#model.NodeSpec.whitespace) option.

##### Returns

`"pre"` \| `"normal"`

## Methods

### allowedMarks()

```ts
allowedMarks(marks): readonly Mark[];
```

Defined in: [packages/model/src/schema/NodeType.ts:454](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L454)

Filters the given marks to only those allowed in this node.
Returns a new array with disallowed marks removed.

#### Parameters

| Parameter | Type                                                        | Description                  |
| --------- | ----------------------------------------------------------- | ---------------------------- |
| `marks`   | readonly [`Mark`](../../../elements/Mark/classes/Mark.md)[] | The array of marks to filter |

#### Returns

readonly [`Mark`](../../../elements/Mark/classes/Mark.md)[]

A new array containing only the marks allowed in this node

---

### allowsMarks()

```ts
allowsMarks(marks): boolean;
```

Defined in: [packages/model/src/schema/NodeType.ts:434](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L434)

Tests whether the given set of marks are all allowed in this node.

#### Parameters

| Parameter | Type                                                        | Description                |
| --------- | ----------------------------------------------------------- | -------------------------- |
| `marks`   | readonly [`Mark`](../../../elements/Mark/classes/Mark.md)[] | The array of marks to test |

#### Returns

`boolean`

True if all marks in the set are allowed in this node

---

### allowsMarkType()

```ts
allowsMarkType(markType): boolean;
```

Defined in: [packages/model/src/schema/NodeType.ts:424](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L424)

Checks whether the given mark type is allowed in this node.

#### Parameters

| Parameter  | Type                                             | Description            |
| ---------- | ------------------------------------------------ | ---------------------- |
| `markType` | [`MarkType`](../../MarkType/classes/MarkType.md) | The mark type to check |

#### Returns

`boolean`

True if the mark type is allowed in this node

---

### checkAttributes()

```ts
protected checkAttributes(values, type): void;
```

Defined in: [packages/model/src/schema/TypeBase.ts:36](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/TypeBase.ts#L36)

Validates attribute values against the type's attribute specifications.
Throws a RangeError if any attribute is unsupported or fails validation.

#### Parameters

| Parameter | Type                                                         | Description                                               |
| --------- | ------------------------------------------------------------ | --------------------------------------------------------- |
| `values`  | [`Attrs`](../../../types/schema/Attrs/type-aliases/Attrs.md) | The attribute values to validate                          |
| `type`    | `string`                                                     | The type name for error messages (e.g., 'node' or 'mark') |

#### Returns

`void`

#### Throws

If an unsupported attribute is found or validation fails

#### Inherited from

[`TypeBase`](../../TypeBase/classes/TypeBase.md).[`checkAttributes`](../../TypeBase/classes/TypeBase.md#checkattributes)

---

### checkAttrs()

```ts
checkAttrs(attrs): void;
```

Defined in: [packages/model/src/schema/NodeType.ts:414](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L414)

Validates attributes for this node type.

#### Parameters

| Parameter | Type                                                         | Description                |
| --------- | ------------------------------------------------------------ | -------------------------- |
| `attrs`   | [`Attrs`](../../../types/schema/Attrs/type-aliases/Attrs.md) | The attributes to validate |

#### Returns

`void`

#### Throws

If any attribute is invalid

---

### checkContent()

```ts
checkContent(content): void;
```

Defined in: [packages/model/src/schema/NodeType.ts:402](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L402)

Validates that the given fragment is valid content for this node type.

#### Parameters

| Parameter | Type                                                         | Description              |
| --------- | ------------------------------------------------------------ | ------------------------ |
| `content` | [`Fragment`](../../../elements/Fragment/classes/Fragment.md) | The fragment to validate |

#### Returns

`void`

#### Throws

If the content is not valid for this node type

---

### compatibleContent()

```ts
compatibleContent(other): boolean;
```

Defined in: [packages/model/src/schema/NodeType.ts:302](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L302)

Checks whether this node type allows some of the same content as another node type.
Used to determine if content can be transferred between different node types.

#### Parameters

| Parameter | Type       | Description                                         |
| --------- | ---------- | --------------------------------------------------- |
| `other`   | `NodeType` | The node type to compare content compatibility with |

#### Returns

`boolean`

True if the content expressions are compatible

---

### computeAttributes()

```ts
protected computeAttributes(providedAttrs): Attrs;
```

Defined in: [packages/model/src/schema/TypeBase.ts:86](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/TypeBase.ts#L86)

Computes a complete set of attributes by merging provided values with defaults.
Ensures all required attributes are present and applies defaults where needed.

#### Parameters

| Parameter       | Type                                              | Description                                    |
| --------------- | ------------------------------------------------- | ---------------------------------------------- |
| `providedAttrs` | `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt; | The attributes provided by the caller, or null |

#### Returns

[`Attrs`](../../../types/schema/Attrs/type-aliases/Attrs.md)

A complete Attrs object with all attributes resolved

#### Throws

If a required attribute (one without a default) is missing

#### Inherited from

[`TypeBase`](../../TypeBase/classes/TypeBase.md).[`computeAttributes`](../../TypeBase/classes/TypeBase.md#computeattributes)

---

### create()

```ts
create(
   attrs?,
   content?,
   marks?): Node;
```

Defined in: [packages/model/src/schema/NodeType.ts:316](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L316)

Creates a Node of this type with the specified attributes, content, and marks.
Attributes are merged with defaults. This method does not validate content.

#### Parameters

| Parameter  | Type                                                                                                                                                                               | Description                                                      |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `attrs?`   | `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt;                                                                                                                                  | Attribute values for the node, or null to use all defaults       |
| `content?` | \| [`Fragment`](../../../elements/Fragment/classes/Fragment.md) \| [`Node`](../../../elements/Node/classes/Node.md) \| readonly [`Node`](../../../elements/Node/classes/Node.md)[] | Fragment, single node, array of nodes, or null for empty content |
| `marks?`   | readonly [`Mark`](../../../elements/Mark/classes/Mark.md)[]                                                                                                                        | Array of marks to apply to the node, or undefined for no marks   |

#### Returns

[`Node`](../../../elements/Node/classes/Node.md)

A new Node instance

#### Throws

If called on the text node type (use schema.text() instead)

---

### createAndFill()

```ts
createAndFill(
   attrs?,
   content?,
   marks?): Node;
```

Defined in: [packages/model/src/schema/NodeType.ts:355](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L355)

Creates a Node like create(), but attempts to add required nodes to the start
or end of the content to satisfy the node type's content expression.
Returns null if the content cannot be made valid.

#### Parameters

| Parameter  | Type                                                                                                                                                                               | Default value | Description                                                      |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ---------------------------------------------------------------- |
| `attrs`    | `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt;                                                                                                                                  | `null`        | Attribute values for the node, or null to use all defaults       |
| `content?` | \| [`Fragment`](../../../elements/Fragment/classes/Fragment.md) \| [`Node`](../../../elements/Node/classes/Node.md) \| readonly [`Node`](../../../elements/Node/classes/Node.md)[] | `undefined`   | Fragment, single node, array of nodes, or null for empty content |
| `marks?`   | readonly [`Mark`](../../../elements/Mark/classes/Mark.md)[]                                                                                                                        | `undefined`   | Array of marks to apply to the node, or undefined for no marks   |

#### Returns

[`Node`](../../../elements/Node/classes/Node.md)

A new Node instance with filled content, or null if content cannot be fixed

#### Remarks

This will always succeed with null or empty content since required nodes
can be automatically created

---

### createChecked()

```ts
createChecked(
   attrs?,
   content?,
   marks?): Node;
```

Defined in: [packages/model/src/schema/NodeType.ts:335](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L335)

Creates a Node like create(), but validates content against the node type's
content restrictions before creating the node.

#### Parameters

| Parameter  | Type                                                                                                                                                                               | Default value | Description                                                      |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ---------------------------------------------------------------- |
| `attrs`    | `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt;                                                                                                                                  | `null`        | Attribute values for the node, or null to use all defaults       |
| `content?` | \| [`Fragment`](../../../elements/Fragment/classes/Fragment.md) \| [`Node`](../../../elements/Node/classes/Node.md) \| readonly [`Node`](../../../elements/Node/classes/Node.md)[] | `undefined`   | Fragment, single node, array of nodes, or null for empty content |
| `marks?`   | readonly [`Mark`](../../../elements/Mark/classes/Mark.md)[]                                                                                                                        | `undefined`   | Array of marks to apply to the node, or undefined for no marks   |

#### Returns

[`Node`](../../../elements/Node/classes/Node.md)

A new Node instance

#### Throws

If the content doesn't match the node type's content expression

---

### createDefaultAttrs()

```ts
protected createDefaultAttrs(): Readonly<Record<string, any>>;
```

Defined in: [packages/model/src/schema/TypeBase.ts:63](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/TypeBase.ts#L63)

Creates a reusable default attributes object for types where all attributes
have default values. This optimization allows sharing the same object across
multiple instances when no custom attributes are specified.

#### Returns

`Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt;

An Attrs object with all default values, or null if any attribute
lacks a default value (indicating required attributes exist)

#### Inherited from

[`TypeBase`](../../TypeBase/classes/TypeBase.md).[`createDefaultAttrs`](../../TypeBase/classes/TypeBase.md#createdefaultattrs)

---

### hasRequiredAttrs()

```ts
hasRequiredAttrs(): boolean;
```

Defined in: [packages/model/src/schema/NodeType.ts:286](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L286)

Checks whether this node type has any required attributes (attributes without default values).

#### Returns

`boolean`

True if at least one attribute is required, false otherwise

---

### initAttrs()

```ts
protected initAttrs(typeName, attrs?): Record<string, Attribute>;
```

Defined in: [packages/model/src/schema/TypeBase.ts:120](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/TypeBase.ts#L120)

Initializes attribute descriptors from the provided specification.
Creates Attribute objects that encapsulate validation and default values.

#### Parameters

| Parameter  | Type                                                                                                               | Description                                       |
| ---------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| `typeName` | `string`                                                                                                           | The name of the type (used in error messages)     |
| `attrs?`   | `Record`&lt;`string`, [`PmAttributeSpec`](../../../types/schema/PmAttributeSpec/interfaces/PmAttributeSpec.md)&gt; | The attribute specifications from the schema spec |

#### Returns

`Record`&lt;`string`, [`Attribute`](../../Attribute/classes/Attribute.md)&gt;

A record mapping attribute names to Attribute descriptors

#### Inherited from

[`TypeBase`](../../TypeBase/classes/TypeBase.md).[`initAttrs`](../../TypeBase/classes/TypeBase.md#initattrs)

---

### isInGroup()

```ts
isInGroup(group): boolean;
```

Defined in: [packages/model/src/schema/NodeType.ts:277](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L277)

Checks whether this node type is part of the given group.
Groups are defined in the node spec and allow categorizing node types.

#### Parameters

| Parameter | Type     | Description                            |
| --------- | -------- | -------------------------------------- |
| `group`   | `string` | The group name to check membership for |

#### Returns

`boolean`

True if this node type belongs to the specified group

---

### validContent()

```ts
validContent(content): boolean;
```

Defined in: [packages/model/src/schema/NodeType.ts:382](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L382)

Checks whether the given fragment is valid content for this node type.
Validates both the content structure and that all marks are allowed.

#### Parameters

| Parameter | Type                                                         | Description              |
| --------- | ------------------------------------------------------------ | ------------------------ |
| `content` | [`Fragment`](../../../elements/Fragment/classes/Fragment.md) | The fragment to validate |

#### Returns

`boolean`

True if the content is valid for this node type

---

### compile()

```ts
static compile<Nodes>(nodes, schema): Readonly<Record<Nodes, NodeType>>;
```

Defined in: [packages/model/src/schema/NodeType.ts:244](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/schema/NodeType.ts#L244)

Compiles a set of node specifications into NodeType instances.
Validates that required node types (top node and text) are present and correctly configured.

#### Type Parameters

| Type Parameter             |
| -------------------------- |
| `Nodes` _extends_ `string` |

#### Parameters

| Parameter | Type                                                                                    | Description                           |
| --------- | --------------------------------------------------------------------------------------- | ------------------------------------- |
| `nodes`   | `OrderedMap`&lt;[`NodeSpec`](../../../types/schema/NodeSpec/interfaces/NodeSpec.md)&gt; | An OrderedMap of node specifications  |
| `schema`  | [`Schema`](../../Schema/classes/Schema.md)&lt;`Nodes`&gt;                               | The schema these node types belong to |

#### Returns

`Readonly`&lt;`Record`&lt;`Nodes`, `NodeType`&gt;&gt;

A readonly record mapping node names to NodeType instances

#### Throws

If the top node type is missing, text type is missing,
or text type has attributes
