[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/changeset](../../README.md) / [ChangeSet](../README.md) / ChangeSet

# Class: ChangeSet&lt;Data&gt;

Defined in: [ChangeSet.ts:53](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/changeset/src/ChangeSet.ts#L53)

A change set tracks the changes to a document from a given point in the past.

It condenses a number of step maps down to a flat sequence of replacements,
and simplifies replacements that partially undo themselves by comparing their content.

The ChangeSet maintains two coordinate systems:

- **A coordinates**: Positions in the original (starting) document
- **B coordinates**: Positions in the current (modified) document

## Example

```typescript
// Create a changeset tracking from a document
const changeSet = ChangeSet.create(startDoc);

// Add steps as they occur
const updated = changeSet.addSteps(newDoc, stepMaps, metadata);

// Access the tracked changes
for (const change of updated.changes) {
  console.log(
    `Replaced ${change.fromA}-${change.toA} with content at ${change.fromB}-${change.toB}`,
  );
}
```

## Type Parameters

| Type Parameter | Default type | Description                                                  |
| -------------- | ------------ | ------------------------------------------------------------ |
| `Data`         | `any`        | The type of metadata associated with changes (default: any). |

## Constructors

### Constructor

```ts
new ChangeSet<Data>(config, changes): ChangeSet<Data>;
```

Defined in: [ChangeSet.ts:82](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/changeset/src/ChangeSet.ts#L82)

Creates a new ChangeSet instance.

#### Parameters

| Parameter | Type                                                                                         | Description                                                                                                |
| --------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `config`  | [`ChangeSetConfig`](../../types/ChangeSetConfig/interfaces/ChangeSetConfig.md)&lt;`Data`&gt; | The configuration object containing the starting document, combine function, and token encoder.            |
| `changes` | readonly [`Change`](../../Change/classes/Change.md)&lt;`Data`&gt;[]                          | The array of changes tracked from the starting document. These represent replaced regions in the document. |

#### Returns

`ChangeSet`&lt;`Data`&gt;

## Properties

| Property                                        | Modifier | Type                                                                                                           | Default value | Description                                                                                                    | Defined in                                                                                                                                   |
| ----------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-computediff"></a> `computeDiff` | `static` | &lt;`T`&gt;(`fragA`, `fragB`, `range`, `encoder`) => [`Change`](../../Change/classes/Change.md)&lt;`any`&gt;[] | `computeDiff` | **`Internal`** Computes a diff between document fragments within a change range. Exposed for testing purposes. | [ChangeSet.ts:61](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/changeset/src/ChangeSet.ts#L61) |

## Accessors

### changes

#### Get Signature

```ts
get changes(): readonly Change<Data>[];
```

Defined in: [ChangeSet.ts:93](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/changeset/src/ChangeSet.ts#L93)

The array of changes tracked from the starting document to the current state.

Each change represents a replaced region, containing information about
what was deleted and what was inserted.

##### Returns

readonly [`Change`](../../Change/classes/Change.md)&lt;`Data`&gt;[]

---

### startDoc

#### Get Signature

```ts
get startDoc(): Node_2;
```

Defined in: [ChangeSet.ts:103](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/changeset/src/ChangeSet.ts#L103)

The starting document of the change set.

This is the document that all changes are tracked relative to.
The A coordinates in all changes refer to positions in this document.

##### Returns

`Node_2`

## Methods

### addSteps()

```ts
addSteps(
   newDoc,
   maps,
   data): ChangeSet<Data>;
```

Defined in: [ChangeSet.ts:165](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/changeset/src/ChangeSet.ts#L165)

Computes a new changeset by adding the given step maps and
metadata (either as an array, per-map, or as a single value to be
associated with all maps) to the current set. Will not mutate the
old set.

Note that due to simplification that happens after each add,
incrementally adding steps might create a different final set
than adding all those changes at once, since different document
tokens might be matched during simplification depending on the
boundaries of the current changed ranges.

#### Parameters

| Parameter | Type                        | Description                                                                                                    |
| --------- | --------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `newDoc`  | `Node_2`                    | The document after applying all the steps.                                                                     |
| `maps`    | readonly `StepMap`[]        | The step maps representing the document transformations.                                                       |
| `data`    | `Data` \| readonly `Data`[] | Metadata to associate with the changes. Can be a single value (applied to all maps) or an array (one per map). |

#### Returns

`ChangeSet`&lt;`Data`&gt;

A new ChangeSet containing the merged changes.

---

### changedRange()

```ts
changedRange(changeSet, maps?): {
  from: number;
  to: number;
};
```

Defined in: [ChangeSet.ts:261](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/changeset/src/ChangeSet.ts#L261)

Compare two changesets and return the range in which they are
changed, if any. If the document changed between the maps, pass
the maps for the steps that changed it as second argument, and
make sure the method is called on the old set and passed the new
set. The returned positions will be in new document coordinates.

#### Parameters

| Parameter   | Type                 | Description                                                                          |
| ----------- | -------------------- | ------------------------------------------------------------------------------------ |
| `changeSet` | `ChangeSet`          | The changeset to compare against.                                                    |
| `maps?`     | readonly `StepMap`[] | Optional step maps representing document transformations between the two changesets. |

#### Returns

```ts
{
  from: number;
  to: number;
}
```

An object with `from` and `to` properties indicating the changed range,
or `null` if the changesets are identical.

| Name   | Type     | Defined in                                                                                                                                     |
| ------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `from` | `number` | [ChangeSet.ts:261](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/changeset/src/ChangeSet.ts#L261) |
| `to`   | `number` | [ChangeSet.ts:261](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/changeset/src/ChangeSet.ts#L261) |

#### Example

```typescript
const range = oldChangeSet.changedRange(newChangeSet, stepMaps);
if (range) {
  console.log(`Content changed from position ${range.from} to ${range.to}`);
}
```

---

### map()

```ts
map<NewData>(callbackFunc): ChangeSet<NewData>;
```

Defined in: [ChangeSet.ts:217](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/changeset/src/ChangeSet.ts#L217)

Map the span's data values in the given set through a function
and construct a new set with the resulting data.

This is useful for transforming the metadata associated with changes,
such as updating user references or converting between data formats.

#### Type Parameters

| Type Parameter | Default type |
| -------------- | ------------ |
| `NewData`      | `Data`       |

#### Parameters

| Parameter      | Type                   | Description                                                                                                                           |
| -------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `callbackFunc` | (`range`) => `NewData` | A function that receives a span and returns the new data value. If the returned data is the same as the original, the span is reused. |

#### Returns

`ChangeSet`&lt;`NewData`&gt;

A new ChangeSet with the transformed data values.

#### Example

```typescript
// Convert user IDs to usernames
const mapped = changeSet.map((span) => userLookup[span.data.userId]);
```

---

### create()

```ts
static create<Data>(
   doc,
   combine?,
   tokenEncoder?,
   changes?): ChangeSet<Data>;
```

Defined in: [ChangeSet.ts:140](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/changeset/src/ChangeSet.ts#L140)

Creates a changeset with the given base document and configuration.

The `combine` function is used to compare and combine metadata—it
should return null when metadata isn't compatible, and a combined
version for a merged range when it is.

When given, a token encoder determines how document tokens are
serialized and compared when diffing the content produced by
changes. The default is to just compare nodes by name and text
by character, ignoring marks and attributes.

#### Type Parameters

| Type Parameter | Default type | Description                                   |
| -------------- | ------------ | --------------------------------------------- |
| `Data`         | `any`        | The type of metadata associated with changes. |

#### Parameters

| Parameter      | Type                                                                               | Default value    | Description                                                                                                                                                                        |
| -------------- | ---------------------------------------------------------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `doc`          | `Node_2`                                                                           | `undefined`      | The starting document from which changes will be tracked.                                                                                                                          |
| `combine`      | (`dataA`, `dataB`) => `Data`                                                       | `...`            | Function to combine metadata from adjacent spans. Returns the combined data, or null if incompatible. Defaults to strict equality comparison.                                      |
| `tokenEncoder` | [`TokenEncoder`](../../types/TokenEncoder/interfaces/TokenEncoder.md)&lt;`any`&gt; | `DefaultEncoder` | Encoder for tokenizing document content during diffs. Defaults to [DefaultEncoder](../../default-encoder/variables/DefaultEncoder.md).                                             |
| `changes`      | readonly [`Change`](../../Change/classes/Change.md)&lt;`Data`&gt;[]                | `[]`             | To serialize a change set, you can store its document and change array as JSON, and then pass the deserialized (via [`Change.fromJSON`](#changes.Change^fromJSON)) set of changes. |

#### Returns

`ChangeSet`&lt;`Data`&gt;

A new empty ChangeSet ready to track changes.

#### Example

```typescript
// Simple usage with default settings
const changeSet = ChangeSet.create(doc);

// With custom metadata combining
const changeSet = ChangeSet.create<string>(doc, (a, b) => (a === b ? a : null));
```
