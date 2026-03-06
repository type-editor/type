[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/model](../../../README.md) / [schema/TypeBase](../README.md) / TypeBase

# Abstract Class: TypeBase

Defined in: [packages/model/src/schema/TypeBase.ts:14](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/schema/TypeBase.ts#L14)

Abstract base class for type objects (NodeType and MarkType).
Provides common functionality for attribute management and validation.

## Extended by

- [`MarkType`](../../MarkType/classes/MarkType.md)
- [`NodeType`](../../NodeType/classes/NodeType.md)

## Constructors

### Constructor

```ts
protected new TypeBase(name, spec): TypeBase;
```

Defined in: [packages/model/src/schema/TypeBase.ts:24](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/schema/TypeBase.ts#L24)

Creates a new TypeBase instance.

#### Parameters

| Parameter | Type                                                                | Description                                        |
| --------- | ------------------------------------------------------------------- | -------------------------------------------------- |
| `name`    | `string`                                                            | The name of the type                               |
| `spec`    | [`NodeSpec`](../../../types/schema/NodeSpec/interfaces/NodeSpec.md) | The specification containing attribute definitions |

#### Returns

`TypeBase`

## Properties

| Property                            | Modifier   | Type                                                                          | Defined in                                                                                                                                                              |
| ----------------------------------- | ---------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-attrs"></a> `attrs` | `readonly` | `Record`&lt;`string`, [`Attribute`](../../Attribute/classes/Attribute.md)&gt; | [packages/model/src/schema/TypeBase.ts:16](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/schema/TypeBase.ts#L16) |

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
