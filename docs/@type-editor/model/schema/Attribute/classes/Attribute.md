[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/model](../../../README.md) / [schema/Attribute](../README.md) / Attribute

# Class: Attribute

Defined in: [packages/model/src/schema/Attribute.ts:10](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/schema/Attribute.ts#L10)

Represents an attribute descriptor for node and mark types.
Encapsulates attribute metadata including default values and validation logic.

## Constructors

### Constructor

```ts
new Attribute(
   typeName,
   attrName,
   options): Attribute;
```

Defined in: [packages/model/src/schema/Attribute.ts:24](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/schema/Attribute.ts#L24)

Creates a new Attribute descriptor.

#### Parameters

| Parameter  | Type                                                                                     | Description                                    |
| ---------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `typeName` | `string`                                                                                 | The name of the type this attribute belongs to |
| `attrName` | `string`                                                                                 | The name of this attribute                     |
| `options`  | [`PmAttributeSpec`](../../../types/schema/PmAttributeSpec/interfaces/PmAttributeSpec.md) | The attribute specification from the schema    |

#### Returns

`Attribute`

## Accessors

### default

#### Get Signature

```ts
get default(): string | number | boolean;
```

Defined in: [packages/model/src/schema/Attribute.ts:41](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/schema/Attribute.ts#L41)

The default value for this attribute, or undefined if no default exists.

##### Returns

`string` \| `number` \| `boolean`

---

### excludeFromMarkupComparison

#### Get Signature

```ts
get excludeFromMarkupComparison(): boolean;
```

Defined in: [packages/model/src/schema/Attribute.ts:62](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/schema/Attribute.ts#L62)

Indicates whether this attribute should be excluded from markup comparison.

##### Returns

`boolean`

---

### hasDefault

#### Get Signature

```ts
get hasDefault(): boolean;
```

Defined in: [packages/model/src/schema/Attribute.ts:48](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/schema/Attribute.ts#L48)

Indicates whether this attribute has a default value.

##### Returns

`boolean`

---

### isRequired

#### Get Signature

```ts
get isRequired(): boolean;
```

Defined in: [packages/model/src/schema/Attribute.ts:34](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/schema/Attribute.ts#L34)

Indicates whether this attribute is required (has no default value).

##### Returns

`boolean`

---

### validate

#### Get Signature

```ts
get validate(): (value) => void;
```

Defined in: [packages/model/src/schema/Attribute.ts:55](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/schema/Attribute.ts#L55)

The validation function for this attribute, if any.

##### Returns

```ts
(value): void;
```

###### Parameters

| Parameter | Type                              |
| --------- | --------------------------------- |
| `value`   | `string` \| `number` \| `boolean` |

###### Returns

`void`
