[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/changeset](../../README.md) / [Span](../README.md) / Span

# Class: Span&lt;Data&gt;

Defined in: [Span.ts:12](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/changeset/src/Span.ts#L12)

Stores metadata for a part of a change.

A Span represents a contiguous range in a document with associated metadata.
Spans are immutable and can be sliced, joined, or cut to create new spans.

## Type Parameters

| Type Parameter | Default type | Description                                     |
| -------------- | ------------ | ----------------------------------------------- |
| `Data`         | `any`        | The type of metadata associated with this span. |

## Constructors

### Constructor

```ts
new Span<Data>(length, data): Span<Data>;
```

Defined in: [Span.ts:26](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/changeset/src/Span.ts#L26)

Creates a new Span with the specified length and associated data.

#### Parameters

| Parameter | Type     | Description                                     |
| --------- | -------- | ----------------------------------------------- |
| `length`  | `number` | The length of this span (must be non-negative). |
| `data`    | `Data`   | The metadata associated with this span.         |

#### Returns

`Span`&lt;`Data`&gt;

## Properties

| Property                          | Modifier   | Type                           | Default value | Description                                        | Defined in                                                                                                                         |
| --------------------------------- | ---------- | ------------------------------ | ------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-none"></a> `none` | `readonly` | readonly `Span`&lt;`any`&gt;[] | `[]`          | An empty span array constant to avoid allocations. | [Span.ts:15](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/changeset/src/Span.ts#L15) |

## Accessors

### data

#### Get Signature

```ts
get data(): Data;
```

Defined in: [Span.ts:37](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/changeset/src/Span.ts#L37)

Returns the metadata associated with this span.

##### Returns

`Data`

---

### length

#### Get Signature

```ts
get length(): number;
```

Defined in: [Span.ts:32](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/changeset/src/Span.ts#L32)

Returns the length of this span.

##### Returns

`number`

## Methods

### join()

```ts
static join<Data>(
   spanListA,
   spanListB,
   combine): readonly Span<Data>[];
```

Defined in: [Span.ts:120](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/changeset/src/Span.ts#L120)

Joins two span arrays, potentially combining adjacent spans at the boundary.

When the last span of the first array and the first span of the second array
meet, the combine function is called. If it returns a value, those spans are
merged into a single span with the combined data.

#### Type Parameters

| Type Parameter | Description                        |
| -------------- | ---------------------------------- |
| `Data`         | The type of metadata in the spans. |

#### Parameters

| Parameter   | Type                            | Description                                                                                                                 |
| ----------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `spanListA` | readonly `Span`&lt;`Data`&gt;[] | The first array of spans.                                                                                                   |
| `spanListB` | readonly `Span`&lt;`Data`&gt;[] | The second array of spans.                                                                                                  |
| `combine`   | (`dataA`, `dataB`) => `Data`    | Function to combine the data of adjacent spans. Returns the combined data, or null/undefined if spans should not be merged. |

#### Returns

readonly `Span`&lt;`Data`&gt;[]

A new array containing the joined spans.

---

### slice()

```ts
static slice<Data>(
   spans,
   from,
   to): readonly Span<Data>[];
```

Defined in: [Span.ts:65](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/changeset/src/Span.ts#L65)

Slices a range from an array of spans.

This extracts a sub-range from a span array, potentially cutting spans
that partially overlap with the range boundaries.

#### Type Parameters

| Type Parameter | Description                        |
| -------------- | ---------------------------------- |
| `Data`         | The type of metadata in the spans. |

#### Parameters

| Parameter | Type                            | Description                       |
| --------- | ------------------------------- | --------------------------------- |
| `spans`   | readonly `Span`&lt;`Data`&gt;[] | The array of spans to slice from. |
| `from`    | `number`                        | The start position (inclusive).   |
| `to`      | `number`                        | The end position (exclusive).     |

#### Returns

readonly `Span`&lt;`Data`&gt;[]

A new array containing the spans within the specified range.
