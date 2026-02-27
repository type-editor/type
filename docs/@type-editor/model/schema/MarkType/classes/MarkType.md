[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/model](../../../README.md) / [schema/MarkType](../README.md) / MarkType

# Class: MarkType

Defined in: [packages/model/src/schema/MarkType.ts:19](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/schema/MarkType.ts#L19)

Marks

Like nodes, marks (which are associated with nodes to signify
things like emphasis or being part of a link) are
[tagged](#model.Mark.type) with type objects, which are
instantiated once per `Schema`.

## Extends

- [`TypeBase`](../../TypeBase/classes/TypeBase.md)

## Constructors

### Constructor

```ts
new MarkType(
   name,
   rank,
   schema,
   spec): MarkType;
```

Defined in: [packages/model/src/schema/MarkType.ts:38](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/schema/MarkType.ts#L38)

Creates a new MarkType instance.

#### Parameters

| Parameter | Type                                                                | Description                                                  |
| --------- | ------------------------------------------------------------------- | ------------------------------------------------------------ |
| `name`    | `string`                                                            | The name of the mark type                                    |
| `rank`    | `number`                                                            | The numeric rank for ordering marks (lower ranks come first) |
| `schema`  | [`Schema`](../../Schema/classes/Schema.md)                          | The schema that this mark type instance is part of           |
| `spec`    | [`MarkSpec`](../../../types/schema/MarkSpec/interfaces/MarkSpec.md) | The specification on which the type is based                 |

#### Returns

`MarkType`

#### Overrides

[`TypeBase`](../../TypeBase/classes/TypeBase.md).[`constructor`](../../TypeBase/classes/TypeBase.md#constructor)

## Properties

| Property                                                            | Modifier    | Type                                                                          | Default value | Inherited from                                                                                                | Defined in                                                                                                                                                              |
| ------------------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-attrs"></a> `attrs`                                 | `readonly`  | `Record`&lt;`string`, [`Attribute`](../../Attribute/classes/Attribute.md)&gt; | `undefined`   | [`TypeBase`](../../TypeBase/classes/TypeBase.md).[`attrs`](../../TypeBase/classes/TypeBase.md#property-attrs) | [packages/model/src/schema/TypeBase.ts:16](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/schema/TypeBase.ts#L16) |
| <a id="property-excludedtypes"></a> `excludedTypes`                 | `protected` | readonly `MarkType`[]                                                         | `undefined`   | -                                                                                                             | [packages/model/src/schema/MarkType.ts:23](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/schema/MarkType.ts#L23) |
| <a id="property-elements_id_attr_name"></a> `ELEMENTS_ID_ATTR_NAME` | `readonly`  | `"id"`                                                                        | `'id'`        | -                                                                                                             | [packages/model/src/schema/MarkType.ts:21](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/schema/MarkType.ts#L21) |

## Accessors

### attributeSpecs

#### Get Signature

```ts
get attributeSpecs(): Record<string, Attribute>;
```

Defined in: [packages/model/src/schema/MarkType.ts:99](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/schema/MarkType.ts#L99)

The attribute specifications for this mark type.
Contains metadata about each attribute including validation and comparison behavior.

##### Returns

`Record`&lt;`string`, [`Attribute`](../../Attribute/classes/Attribute.md)&gt;

---

### excluded

#### Get Signature

```ts
get excluded(): readonly MarkType[];
```

Defined in: [packages/model/src/schema/MarkType.ts:54](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/schema/MarkType.ts#L54)

The array of mark types that are excluded by this mark type.
By default, marks exclude themselves, preventing multiple instances of the same mark.

##### Returns

readonly `MarkType`[]

#### Set Signature

```ts
set excluded(value): void;
```

Defined in: [packages/model/src/schema/MarkType.ts:62](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/schema/MarkType.ts#L62)

Sets the array of mark types excluded by this mark.

##### Parameters

| Parameter | Type                  | Description                                |
| --------- | --------------------- | ------------------------------------------ |
| `value`   | readonly `MarkType`[] | The array of MarkType instances to exclude |

##### Returns

`void`

---

### name

#### Get Signature

```ts
get name(): string;
```

Defined in: [packages/model/src/schema/MarkType.ts:69](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/schema/MarkType.ts#L69)

The name of this mark type.

##### Returns

`string`

---

### rank

#### Get Signature

```ts
get rank(): number;
```

Defined in: [packages/model/src/schema/MarkType.ts:91](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/schema/MarkType.ts#L91)

The numeric rank of this mark type, used for ordering marks.
Lower rank numbers appear first when marks are sorted.

##### Returns

`number`

---

### schema

#### Get Signature

```ts
get schema(): Schema;
```

Defined in: [packages/model/src/schema/MarkType.ts:76](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/schema/MarkType.ts#L76)

The schema that this mark type is part of.

##### Returns

[`Schema`](../../Schema/classes/Schema.md)

---

### spec

#### Get Signature

```ts
get spec(): MarkSpec;
```

Defined in: [packages/model/src/schema/MarkType.ts:83](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/schema/MarkType.ts#L83)

The spec that this mark type is based on.

##### Returns

[`MarkSpec`](../../../types/schema/MarkSpec/interfaces/MarkSpec.md)

## Methods

### checkAttributes()

```ts
protected checkAttributes(values, type): void;
```

Defined in: [packages/model/src/schema/TypeBase.ts:36](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/schema/TypeBase.ts#L36)

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

Defined in: [packages/model/src/schema/MarkType.ts:181](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/schema/MarkType.ts#L181)

Validates attributes for this mark type.

#### Parameters

| Parameter | Type                                                         | Description                |
| --------- | ------------------------------------------------------------ | -------------------------- |
| `attrs`   | [`Attrs`](../../../types/schema/Attrs/type-aliases/Attrs.md) | The attributes to validate |

#### Returns

`void`

#### Throws

If any attribute is invalid

---

### computeAttributes()

```ts
protected computeAttributes(providedAttrs): Attrs;
```

Defined in: [packages/model/src/schema/TypeBase.ts:86](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/schema/TypeBase.ts#L86)

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
create(attrs?): Mark;
```

Defined in: [packages/model/src/schema/MarkType.ts:128](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/schema/MarkType.ts#L128)

Creates a mark of this type with the specified attributes.
Attributes are merged with defaults. Returns a cached instance if possible.

#### Parameters

| Parameter | Type                                              | Default value | Description                                                |
| --------- | ------------------------------------------------- | ------------- | ---------------------------------------------------------- |
| `attrs`   | `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt; | `null`        | Attribute values for the mark, or null to use all defaults |

#### Returns

[`Mark`](../../../elements/Mark/classes/Mark.md)

A Mark instance

---

### createDefaultAttrs()

```ts
protected createDefaultAttrs(): Readonly<Record<string, any>>;
```

Defined in: [packages/model/src/schema/TypeBase.ts:63](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/schema/TypeBase.ts#L63)

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

### excludes()

```ts
excludes(other): boolean;
```

Defined in: [packages/model/src/schema/MarkType.ts:192](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/schema/MarkType.ts#L192)

Checks whether the given mark type is excluded by this one.
Based on the excludes specification in the mark's schema spec.

#### Parameters

| Parameter | Type       | Description                          |
| --------- | ---------- | ------------------------------------ |
| `other`   | `MarkType` | The mark type to check exclusion for |

#### Returns

`boolean`

True if the other mark type is excluded by this one

---

### initAttrs()

```ts
protected initAttrs(typeName, attrs?): Record<string, Attribute>;
```

Defined in: [packages/model/src/schema/TypeBase.ts:120](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/schema/TypeBase.ts#L120)

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

### isInSet()

```ts
isInSet(set): Mark;
```

Defined in: [packages/model/src/schema/MarkType.ts:167](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/schema/MarkType.ts#L167)

Searches for a mark of this type in the given set.

#### Parameters

| Parameter | Type                                                        | Description                  |
| --------- | ----------------------------------------------------------- | ---------------------------- |
| `set`     | readonly [`Mark`](../../../elements/Mark/classes/Mark.md)[] | The array of marks to search |

#### Returns

[`Mark`](../../../elements/Mark/classes/Mark.md)

The first mark of this type found, or undefined if none exists

---

### removeFromSet()

```ts
removeFromSet(set): readonly Mark[];
```

Defined in: [packages/model/src/schema/MarkType.ts:142](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/schema/MarkType.ts#L142)

Removes all marks of this type from the given set.
Returns a new array without marks of this type, or the original if none found.

#### Parameters

| Parameter | Type                                                        | Description                  |
| --------- | ----------------------------------------------------------- | ---------------------------- |
| `set`     | readonly [`Mark`](../../../elements/Mark/classes/Mark.md)[] | The array of marks to filter |

#### Returns

readonly [`Mark`](../../../elements/Mark/classes/Mark.md)[]

A new array without marks of this type

---

### compile()

```ts
static compile(marks, schema): Record<string, MarkType>;
```

Defined in: [packages/model/src/schema/MarkType.ts:111](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/schema/MarkType.ts#L111)

Compiles a set of mark specifications into MarkType instances.
Assigns sequential rank numbers to maintain mark ordering.

#### Parameters

| Parameter | Type                                                                                    | Description                           |
| --------- | --------------------------------------------------------------------------------------- | ------------------------------------- |
| `marks`   | `OrderedMap`&lt;[`MarkSpec`](../../../types/schema/MarkSpec/interfaces/MarkSpec.md)&gt; | An OrderedMap of mark specifications  |
| `schema`  | [`Schema`](../../Schema/classes/Schema.md)                                              | The schema these mark types belong to |

#### Returns

`Record`&lt;`string`, `MarkType`&gt;

A record mapping mark names to MarkType instances
