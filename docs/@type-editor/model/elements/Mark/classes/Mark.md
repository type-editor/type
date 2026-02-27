[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/model](../../../README.md) / [elements/Mark](../README.md) / Mark

# Class: Mark

Defined in: [packages/model/src/elements/Mark.ts:20](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/elements/Mark.ts#L20)

A mark is a piece of information that can be attached to a node,
such as it being emphasized, in code font, or a link. It has a
type and optionally a set of attributes that provide further
information (such as the target of the link). Marks are created
through a `Schema`, which controls which types exist and which
attributes they have.

## Implements

- [`PmElement`](../../../types/elements/PmElement/interfaces/PmElement.md)

## Constructors

### Constructor

```ts
new Mark(type, attrs): Mark;
```

Defined in: [packages/model/src/elements/Mark.ts:37](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/elements/Mark.ts#L37)

Create a mark of the given type, with the given attributes.

#### Parameters

| Parameter | Type                                                         | Description                               |
| --------- | ------------------------------------------------------------ | ----------------------------------------- |
| `type`    | [`MarkType`](../../../schema/MarkType/classes/MarkType.md)   | The type of this mark.                    |
| `attrs`   | [`Attrs`](../../../types/schema/Attrs/type-aliases/Attrs.md) | The attributes associated with this mark. |

#### Returns

`Mark`

## Properties

| Property                          | Modifier   | Type              | Description                                                                                                      | Defined in                                                                                                                                                          |
| --------------------------------- | ---------- | ----------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-none"></a> `none` | `readonly` | readonly `Mark`[] | The empty set of marks. This is a frozen, shared instance that can be used anywhere an empty mark set is needed. | [packages/model/src/elements/Mark.ts:26](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/elements/Mark.ts#L26) |

## Accessors

### attrs

#### Get Signature

```ts
get attrs(): Attrs;
```

Defined in: [packages/model/src/elements/Mark.ts:50](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/elements/Mark.ts#L50)

##### Returns

[`Attrs`](../../../types/schema/Attrs/type-aliases/Attrs.md)

---

### elementType

#### Get Signature

```ts
get elementType(): ElementType;
```

Defined in: [packages/model/src/elements/Mark.ts:42](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/elements/Mark.ts#L42)

##### Returns

[`ElementType`](../../ElementType/enumerations/ElementType.md)

#### Implementation of

[`PmElement`](../../../types/elements/PmElement/interfaces/PmElement.md).[`elementType`](../../../types/elements/PmElement/interfaces/PmElement.md#property-elementtype)

---

### type

#### Get Signature

```ts
get type(): MarkType;
```

Defined in: [packages/model/src/elements/Mark.ts:46](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/elements/Mark.ts#L46)

##### Returns

[`MarkType`](../../../schema/MarkType/classes/MarkType.md)

## Methods

### addToSet()

```ts
addToSet(set): readonly Mark[];
```

Defined in: [packages/model/src/elements/Mark.ts:151](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/elements/Mark.ts#L151)

Given a set of marks, create a new set which contains this mark as
well, in the right position. The marks are kept sorted by their type's rank.

If this mark is already in the set, the original set is returned unchanged.
If any marks that are set to be [exclusive](#model.MarkSpec.excludes) with
this mark are present, those are replaced by this one. If this mark is
excluded by any mark in the set, the original set is returned unchanged.

#### Parameters

| Parameter | Type              | Description                                    |
| --------- | ----------------- | ---------------------------------------------- |
| `set`     | readonly `Mark`[] | The existing set of marks to add this mark to. |

#### Returns

readonly `Mark`[]

A new mark set with this mark added, or the original set if no changes are needed.

---

### eq()

```ts
eq(other): boolean;
```

Defined in: [packages/model/src/elements/Mark.ts:237](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/elements/Mark.ts#L237)

Test whether this mark has the same type and attributes as
another mark. Two marks are considered equal if they are the same
instance, or if they have the same type and deep-equal attributes.
Attributes marked with `excludeFromMarkupComparison` are ignored
during comparison.

#### Parameters

| Parameter | Type   | Description                         |
| --------- | ------ | ----------------------------------- |
| `other`   | `Mark` | The mark to compare with this mark. |

#### Returns

`boolean`

`true` if the marks are equivalent, `false` otherwise.

---

### isInSet()

```ts
isInSet(set): boolean;
```

Defined in: [packages/model/src/elements/Mark.ts:223](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/elements/Mark.ts#L223)

Test whether this mark is in the given set of marks.

#### Parameters

| Parameter | Type              | Description                    |
| --------- | ----------------- | ------------------------------ |
| `set`     | readonly `Mark`[] | The set of marks to search in. |

#### Returns

`boolean`

`true` if an equivalent mark is found in the set, `false` otherwise.

---

### removeFromSet()

```ts
removeFromSet(set): readonly Mark[];
```

Defined in: [packages/model/src/elements/Mark.ts:208](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/elements/Mark.ts#L208)

Remove this mark from the given set, returning a new set. If this
mark is not in the set, the original set is returned unchanged.

#### Parameters

| Parameter | Type              | Description                                |
| --------- | ----------------- | ------------------------------------------ |
| `set`     | readonly `Mark`[] | The set of marks to remove this mark from. |

#### Returns

readonly `Mark`[]

A new mark set without this mark, or the original set if this mark wasn't present.

---

### toJSON()

```ts
toJSON(): MarkJSON;
```

Defined in: [packages/model/src/elements/Mark.ts:282](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/elements/Mark.ts#L282)

Convert this mark to a JSON-serializable representation.
The resulting object contains the mark type name and optionally
its attributes (if non-empty).

#### Returns

[`MarkJSON`](../../../types/elements/MarkJSON/interfaces/MarkJSON.md)

A JSON representation of this mark.

---

### fromJSON()

```ts
static fromJSON(schema, json): Mark;
```

Defined in: [packages/model/src/elements/Mark.ts:76](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/elements/Mark.ts#L76)

Deserialize a mark from its JSON representation.

#### Parameters

| Parameter | Type                                                                  | Description                                   |
| --------- | --------------------------------------------------------------------- | --------------------------------------------- |
| `schema`  | [`Schema`](../../../schema/Schema/classes/Schema.md)                  | The schema to use for deserializing the mark. |
| `json`    | [`MarkJSON`](../../../types/elements/MarkJSON/interfaces/MarkJSON.md) | The JSON object representing the mark.        |

#### Returns

`Mark`

A new Mark instance.

#### Throws

If the JSON is invalid or the mark type doesn't exist in the schema.

---

### sameSet()

```ts
static sameSet(a, b): boolean;
```

Defined in: [packages/model/src/elements/Mark.ts:102](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/elements/Mark.ts#L102)

Test whether two sets of marks are identical. Two mark sets are considered
identical if they have the same length and contain equivalent marks at each position.

#### Parameters

| Parameter | Type              | Description                     |
| --------- | ----------------- | ------------------------------- |
| `a`       | readonly `Mark`[] | The first mark set to compare.  |
| `b`       | readonly `Mark`[] | The second mark set to compare. |

#### Returns

`boolean`

`true` if the mark sets are identical, `false` otherwise.

---

### setFrom()

```ts
static setFrom(marks?): readonly Mark[];
```

Defined in: [packages/model/src/elements/Mark.ts:125](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/elements/Mark.ts#L125)

Create a properly sorted mark set from null, a single mark, or an
unsorted array of marks. The marks are sorted by their type's rank.

#### Parameters

| Parameter | Type                        | Description                                                                                                                       |
| --------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `marks?`  | `Mark` \| readonly `Mark`[] | A single mark, an array of marks, null, or undefined. If null, undefined, or an empty array, returns [Mark.none](#property-none). |

#### Returns

readonly `Mark`[]

A sorted, read-only array of marks.
