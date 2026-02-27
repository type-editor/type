[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/model](../../../README.md) / [elements/Slice](../README.md) / Slice

# Class: Slice

Defined in: [packages/model/src/elements/Slice.ts:16](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/elements/Slice.ts#L16)

A slice represents a piece cut out of a larger document. It
stores not only a fragment, but also the depth up to which nodes on
both side are 'open' (cut through).

## Implements

- [`PmElement`](../../../types/elements/PmElement/interfaces/PmElement.md)

## Constructors

### Constructor

```ts
new Slice(
   content,
   openStart,
   openEnd): Slice;
```

Defined in: [packages/model/src/elements/Slice.ts:59](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/elements/Slice.ts#L59)

Create a slice. When specifying a non-zero open depth, you must
make sure that there are nodes of at least that depth at the
appropriate side of the fragment—i.e. if the fragment is an
empty paragraph node, `openStart` and `openEnd` can't be greater
than 1.

It is not necessary for the content of open nodes to conform to
the schema's content constraints, though it should be a valid
start/end/middle for such a node, depending on which sides are
open.

#### Parameters

| Parameter   | Type                                             | Description                                  |
| ----------- | ------------------------------------------------ | -------------------------------------------- |
| `content`   | [`Fragment`](../../Fragment/classes/Fragment.md) | The slice's content.                         |
| `openStart` | `number`                                         | The open depth at the start of the fragment. |
| `openEnd`   | `number`                                         | The open depth at the end.                   |

#### Returns

`Slice`

#### Throws

If openStart or openEnd are negative.

## Accessors

### content

#### Get Signature

```ts
get content(): Fragment;
```

Defined in: [packages/model/src/elements/Slice.ts:102](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/elements/Slice.ts#L102)

The fragment containing the slice's content.

##### Returns

[`Fragment`](../../Fragment/classes/Fragment.md)

---

### elementType

#### Get Signature

```ts
get elementType(): ElementType;
```

Defined in: [packages/model/src/elements/Slice.ts:68](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/elements/Slice.ts#L68)

##### Returns

[`ElementType`](../../ElementType/enumerations/ElementType.md)

#### Implementation of

[`PmElement`](../../../types/elements/PmElement/interfaces/PmElement.md).[`elementType`](../../../types/elements/PmElement/interfaces/PmElement.md#property-elementtype)

---

### openEnd

#### Get Signature

```ts
get openEnd(): number;
```

Defined in: [packages/model/src/elements/Slice.ts:118](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/elements/Slice.ts#L118)

The open depth at the end of the slice.
Indicates how many parent nodes are open (cut through) at the end.

##### Returns

`number`

---

### openStart

#### Get Signature

```ts
get openStart(): number;
```

Defined in: [packages/model/src/elements/Slice.ts:110](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/elements/Slice.ts#L110)

The open depth at the start of the slice.
Indicates how many parent nodes are open (cut through) at the beginning.

##### Returns

`number`

---

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [packages/model/src/elements/Slice.ts:129](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/elements/Slice.ts#L129)

The size this slice would add when inserted into a document.
This is calculated as the content size minus the open depths on both sides,
since open nodes don't add to the insertion size.

##### Returns

`number`

The effective size of the slice for insertion purposes.

---

### empty

#### Get Signature

```ts
get static empty(): Slice;
```

Defined in: [packages/model/src/elements/Slice.ts:92](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/elements/Slice.ts#L92)

Returns the singleton empty slice instance.
An empty slice has no content and zero open depths on both sides.

##### Returns

`Slice`

A shared empty Slice instance.

## Methods

### eq()

```ts
eq(other): boolean;
```

Defined in: [packages/model/src/elements/Slice.ts:232](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/elements/Slice.ts#L232)

Tests whether this slice is equal to another slice.
Two slices are equal if they have the same content, openStart, and openEnd values.

#### Parameters

| Parameter | Type    | Description                |
| --------- | ------- | -------------------------- |
| `other`   | `Slice` | The slice to compare with. |

#### Returns

`boolean`

True if the slices are equal, false otherwise.

---

### insertAt()

```ts
insertAt(pos, fragment): Slice;
```

Defined in: [packages/model/src/elements/Slice.ts:198](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/elements/Slice.ts#L198)

Insert a fragment at a specific position within this slice.

#### Parameters

| Parameter  | Type                                             | Description                                   |
| ---------- | ------------------------------------------------ | --------------------------------------------- |
| `pos`      | `number`                                         | The position at which to insert the fragment. |
| `fragment` | [`Fragment`](../../Fragment/classes/Fragment.md) | The fragment to insert.                       |

#### Returns

`Slice`

A new Slice with the fragment inserted, or null if insertion is not possible.

#### Throws

If the position is invalid (negative).

---

### removeBetween()

```ts
removeBetween(from, to): Slice;
```

Defined in: [packages/model/src/elements/Slice.ts:214](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/elements/Slice.ts#L214)

Remove content between two positions in this slice.

#### Parameters

| Parameter | Type     | Description                                   |
| --------- | -------- | --------------------------------------------- |
| `from`    | `number` | The starting position of the range to remove. |
| `to`      | `number` | The ending position of the range to remove.   |

#### Returns

`Slice`

A new Slice with the specified range removed.

#### Throws

If the range is invalid or not flat (spans multiple depth levels).

---

### toJSON()

```ts
toJSON(): SliceJSON;
```

Defined in: [packages/model/src/elements/Slice.ts:252](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/elements/Slice.ts#L252)

Convert a slice to a JSON-serializable representation.

#### Returns

[`SliceJSON`](../../../types/elements/SliceJSON/interfaces/SliceJSON.md)

A JSON representation of the slice, or null if the slice is empty.

---

### toString()

```ts
toString(): string;
```

Defined in: [packages/model/src/elements/Slice.ts:243](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/elements/Slice.ts#L243)

Return a string representation of the slice for debugging purposes.

#### Returns

`string`

A string representation showing the content and open depths.

---

### fromJSON()

```ts
static fromJSON(schema, json): Slice;
```

Defined in: [packages/model/src/elements/Slice.ts:140](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/elements/Slice.ts#L140)

Deserialize a slice from its JSON representation.

#### Parameters

| Parameter | Type                                                                     | Description                                      |
| --------- | ------------------------------------------------------------------------ | ------------------------------------------------ |
| `schema`  | [`Schema`](../../../schema/Schema/classes/Schema.md)                     | The schema to use for deserializing the content. |
| `json`    | [`SliceJSON`](../../../types/elements/SliceJSON/interfaces/SliceJSON.md) | The JSON representation of the slice.            |

#### Returns

`Slice`

A new Slice instance or the empty slice if json is null/undefined.

---

### maxOpen()

```ts
static maxOpen(fragment, openIsolating?): Slice;
```

Defined in: [packages/model/src/elements/Slice.ts:164](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/elements/Slice.ts#L164)

Create a slice from a fragment by taking the maximum possible
open value on both sides of the fragment. This traverses down
the first and last children to determine how many levels can be
opened.

#### Parameters

| Parameter       | Type                                             | Default value | Description                                                |
| --------------- | ------------------------------------------------ | ------------- | ---------------------------------------------------------- |
| `fragment`      | [`Fragment`](../../Fragment/classes/Fragment.md) | `undefined`   | The fragment to create a slice from.                       |
| `openIsolating` | `boolean`                                        | `true`        | Whether to open through isolating nodes. Defaults to true. |

#### Returns

`Slice`

A new Slice with maximum possible open depths.
