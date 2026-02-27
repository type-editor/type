[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/changeset](../../README.md) / [Change](../README.md) / Change

# Class: Change&lt;Data&gt;

Defined in: [Change.ts:34](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/changeset/src/Change.ts#L34)

Represents a change between two document versions with metadata.

A Change tracks a replaced range in the document, including both what was
deleted from the old version and what was inserted in the new version.
It uses two coordinate systems:

- A coordinates: positions in the old document
- B coordinates: positions in the new document

## Type Parameters

| Type Parameter | Default type | Description                                               |
| -------------- | ------------ | --------------------------------------------------------- |
| `Data`         | `any`        | The type of metadata associated with the changed content. |

## Constructors

### Constructor

```ts
new Change<Data>(
   fromA,
   toA,
   fromB,
   toB,
   deleted,
   inserted): Change<Data>;
```

Defined in: [Change.ts:55](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/changeset/src/Change.ts#L55)

Creates a new Change representing a document modification.

#### Parameters

| Parameter  | Type                                                          | Description                                                                                        |
| ---------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `fromA`    | `number`                                                      | The start position of the range in the old document (A coordinates).                               |
| `toA`      | `number`                                                      | The end position of the range in the old document (A coordinates).                                 |
| `fromB`    | `number`                                                      | The start position of the range in the new document (B coordinates).                               |
| `toB`      | `number`                                                      | The end position of the range in the new document (B coordinates).                                 |
| `deleted`  | readonly [`Span`](../../Span/classes/Span.md)&lt;`Data`&gt;[] | Metadata spans for the deleted content. The total length of these spans must equal `toA - fromA`.  |
| `inserted` | readonly [`Span`](../../Span/classes/Span.md)&lt;`Data`&gt;[] | Metadata spans for the inserted content. The total length of these spans must equal `toB - fromB`. |

#### Returns

`Change`&lt;`Data`&gt;

## Accessors

### deleted

#### Get Signature

```ts
get deleted(): readonly Span<Data>[];
```

Defined in: [Change.ts:90](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/changeset/src/Change.ts#L90)

The spans of deleted content with associated metadata.

##### Returns

readonly [`Span`](../../Span/classes/Span.md)&lt;`Data`&gt;[]

---

### fromA

#### Get Signature

```ts
get fromA(): number;
```

Defined in: [Change.ts:70](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/changeset/src/Change.ts#L70)

The start position in the old document (A coordinates).

##### Returns

`number`

---

### fromB

#### Get Signature

```ts
get fromB(): number;
```

Defined in: [Change.ts:80](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/changeset/src/Change.ts#L80)

The start position in the new document (B coordinates).

##### Returns

`number`

---

### inserted

#### Get Signature

```ts
get inserted(): readonly Span<Data>[];
```

Defined in: [Change.ts:95](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/changeset/src/Change.ts#L95)

The spans of inserted content with associated metadata.

##### Returns

readonly [`Span`](../../Span/classes/Span.md)&lt;`Data`&gt;[]

---

### lenA

#### Get Signature

```ts
get lenA(): number;
```

Defined in: [Change.ts:100](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/changeset/src/Change.ts#L100)

The length of the deleted range in the old document.

##### Returns

`number`

---

### lenB

#### Get Signature

```ts
get lenB(): number;
```

Defined in: [Change.ts:105](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/changeset/src/Change.ts#L105)

The length of the inserted range in the new document.

##### Returns

`number`

---

### toA

#### Get Signature

```ts
get toA(): number;
```

Defined in: [Change.ts:75](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/changeset/src/Change.ts#L75)

The end position in the old document (A coordinates).

##### Returns

`number`

---

### toB

#### Get Signature

```ts
get toB(): number;
```

Defined in: [Change.ts:85](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/changeset/src/Change.ts#L85)

The end position in the new document (B coordinates).

##### Returns

`number`

## Methods

### slice()

```ts
slice(
   startA,
   endA,
   startB,
   endB): Change<Data>;
```

Defined in: [Change.ts:424](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/changeset/src/Change.ts#L424)

Creates a sub-change by slicing ranges from both coordinate systems.

This extracts a portion of this change, specified by ranges in both
the A and B coordinate systems. If the slice covers the entire change,
returns this instance to avoid allocation.

#### Parameters

| Parameter | Type     | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| `startA`  | `number` | The start position in A coordinates (relative to this change). |
| `endA`    | `number` | The end position in A coordinates (relative to this change).   |
| `startB`  | `number` | The start position in B coordinates (relative to this change). |
| `endB`    | `number` | The end position in B coordinates (relative to this change).   |

#### Returns

`Change`&lt;`Data`&gt;

A new Change representing the specified slice, or this if unchanged.

---

### toJSON()

```ts
toJSON(): ChangeJSON<Data>;
```

Defined in: [Change.ts:453](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/changeset/src/Change.ts#L453)

Serializes this Change to a JSON-compatible representation.

Since the Change class structure matches the ChangeJSON interface,
this method returns the instance itself.

#### Returns

[`ChangeJSON`](../../types/ChangeJSON/interfaces/ChangeJSON.md)&lt;`Data`&gt;

A JSON representation of this change.

---

### fromJSON()

```ts
static fromJSON<Data>(json): Change<Data>;
```

Defined in: [Change.ts:202](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/changeset/src/Change.ts#L202)

Deserializes a Change from its JSON representation.

#### Type Parameters

| Type Parameter | Description                         |
| -------------- | ----------------------------------- |
| `Data`         | The type of metadata in the change. |

#### Parameters

| Parameter | Type                                                                          | Description                              |
| --------- | ----------------------------------------------------------------------------- | ---------------------------------------- |
| `json`    | [`ChangeJSON`](../../types/ChangeJSON/interfaces/ChangeJSON.md)&lt;`Data`&gt; | The JSON object representing the change. |

#### Returns

`Change`&lt;`Data`&gt;

A new Change instance reconstructed from the JSON data.

---

### merge()

```ts
static merge<Data>(
   x,
   y,
   combine): readonly Change<Data>[];
```

Defined in: [Change.ts:126](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/changeset/src/Change.ts#L126)

Merges two changesets into a single changeset.

This combines two sequential changesets where the end document of the first
changeset is the start document of the second. The result is a single changeset
spanning from the start of the first to the end of the second.

The merge operates by synchronizing over a "middle" coordinate system:

- For the first changeset (x): the B coordinates represent the middle document
- For the second changeset (y): the A coordinates represent the middle document

#### Type Parameters

| Type Parameter | Description                          |
| -------------- | ------------------------------------ |
| `Data`         | The type of metadata in the changes. |

#### Parameters

| Parameter | Type                              | Description                                                |
| --------- | --------------------------------- | ---------------------------------------------------------- |
| `x`       | readonly `Change`&lt;`Data`&gt;[] | The first changeset.                                       |
| `y`       | readonly `Change`&lt;`Data`&gt;[] | The second changeset applied after x.                      |
| `combine` | (`dataA`, `dataB`) => `Data`      | Function to combine metadata when spans need to be merged. |

#### Returns

readonly `Change`&lt;`Data`&gt;[]

A single changeset representing both transformations.
