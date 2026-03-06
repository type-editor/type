[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [change-map/Mapping](../README.md) / Mapping

# Class: Mapping

Defined in: [packages/transform/src/change-map/Mapping.ts:29](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-map/Mapping.ts#L29)

A mapping represents a pipeline of zero or more [step maps](#transform.StepMap).

Mappings are used to track how positions in a document change as transformations
are applied. They have special provisions for losslessly handling mapping positions
through a series of steps in which some steps are inverted versions of earlier steps.
This is essential for '[rebasing](/docs/guide/#transform.rebasing)' steps in
collaborative editing or history management scenarios.

## Example

```typescript
// Create a mapping with step maps
const mapping = new Mapping();
mapping.appendMap(new StepMap([2, 0, 4])); // Insert 4 chars at position 2

// Map a position through the transformation
const newPos = mapping.map(5); // Returns 9 (5 + 4)

// Handle mirrored steps (undo/redo)
mapping.appendMap(deleteStep, 0); // Mirror with first step
```

## Implements

- `Mappable`

## Constructors

### Constructor

```ts
new Mapping(
   maps?,
   mirror?,
   from?,
   to?): Mapping;
```

Defined in: [packages/transform/src/change-map/Mapping.ts:101](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-map/Mapping.ts#L101)

Create a new mapping with the given position maps.

#### Parameters

| Parameter | Type                   | Default value | Description                                                                                                                                                                                                            |
| --------- | ---------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `maps?`   | readonly `PmStepMap`[] | `undefined`   | Optional array of step maps to include in this mapping. If provided, the array is copied (not shared) to allow safe modification. If omitted, creates an empty mapping.                                                |
| `mirror?` | `number`[]             | `undefined`   | Optional array of mirrored step map index pairs stored as consecutive values: `[index1, mirrorIndex1, index2, mirrorIndex2, ...]`. Each pair indicates that the step maps at those indices are inverses of each other. |
| `from?`   | `number`               | `0`           | The starting position in the `maps` array, used when `map` or `mapResult` is called. Defaults to 0. Allows creating a mapping slice that only applies a subset of maps.                                                |
| `to?`     | `number`               | `undefined`   | The end position (exclusive) in the `maps` array. Defaults to `maps.length`. Only maps in the range `[from, to)` are applied during mapping operations.                                                                |

#### Returns

`Mapping`

#### Example

```typescript
// Create an empty mapping
const mapping1 = new Mapping();

// Create with initial step maps
const mapping2 = new Mapping([stepMap1, stepMap2]);

// Create a slice that only uses the second map
const mapping3 = new Mapping([stepMap1, stepMap2], undefined, 1, 2);
```

## Accessors

### from

#### Get Signature

```ts
get from(): number;
```

Defined in: [packages/transform/src/change-map/Mapping.ts:133](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-map/Mapping.ts#L133)

Returns the starting position in the `maps` array.

When `map()` or `mapResult()` is called, only step maps from index `from` to `to` are applied.
This allows creating slices of a mapping without copying the underlying arrays.

##### Returns

`number`

The starting index for mapping operations.

---

### maps

#### Get Signature

```ts
get maps(): readonly PmStepMap[];
```

Defined in: [packages/transform/src/change-map/Mapping.ts:121](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-map/Mapping.ts#L121)

Returns the step maps in this mapping.

This provides access to all step maps in the mapping, not just those in the
active range defined by `from` and `to`. The returned array is read-only to
prevent external modifications. Use `appendMap()` to add new maps.

##### Returns

readonly `PmStepMap`[]

A read-only array of step maps representing the transformation pipeline.

---

### to

#### Get Signature

```ts
get to(): number;
```

Defined in: [packages/transform/src/change-map/Mapping.ts:145](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-map/Mapping.ts#L145)

Returns the end position (exclusive) in the `maps` array.

When `map()` or `mapResult()` is called, only step maps from index `from` to `to` are applied.
This is updated when new maps are appended via `appendMap()`.

##### Returns

`number`

The ending index for mapping operations.

## Methods

### appendMap()

```ts
appendMap(map, mirrors?): void;
```

Defined in: [packages/transform/src/change-map/Mapping.ts:194](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-map/Mapping.ts#L194)

Add a step map to the end of this mapping.

If the mapping doesn't own its data arrays (when created with shared arrays),
this method will first copy them to ensure safe modification. The `to` index
is automatically updated to reflect the new length.

#### Parameters

| Parameter  | Type        | Description                                                                                                                                                                                                                                                               |
| ---------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `map`      | `PmStepMap` | The step map to append to this mapping.                                                                                                                                                                                                                                   |
| `mirrors?` | `number`    | Optional index of the step map that is the mirror (inverse) of the one being added. When provided, establishes a mirror relationship that allows position recovery when mapping through deleted content. The mirror index refers to a position in the current maps array. |

#### Returns

`void`

#### Example

```typescript
const mapping = new Mapping();
const deleteMap = new StepMap([2, 4, 0]); // Delete 4 chars at pos 2
mapping.appendMap(deleteMap);

const insertMap = new StepMap([2, 0, 4]); // Insert 4 chars at pos 2
mapping.appendMap(insertMap, 0); // Mirror with the delete at index 0
```

---

### appendMapping()

```ts
appendMapping(mapping): void;
```

Defined in: [packages/transform/src/change-map/Mapping.ts:223](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-map/Mapping.ts#L223)

Add all the step maps in a given mapping to this one, preserving mirroring information.

This method iterates through all step maps in the provided mapping and appends them
to this mapping. Mirror relationships are preserved by adjusting the mirror indices
to account for the current size of this mapping.

#### Parameters

| Parameter | Type      | Description                                                                                                                                     |
| --------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `mapping` | `Mapping` | The mapping whose step maps should be appended. All maps and their mirror relationships from this mapping will be added to the current mapping. |

#### Returns

`void`

#### Example

```typescript
const mapping1 = new Mapping([map1, map2]);
const mapping2 = new Mapping([map3, map4]);
mapping1.appendMapping(mapping2); // mapping1 now contains [map1, map2, map3, map4]
```

---

### getMirror()

```ts
getMirror(offset): number;
```

Defined in: [packages/transform/src/change-map/Mapping.ts:252](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-map/Mapping.ts#L252)

Finds the offset of the step map that mirrors the map at the given offset.

Mirror relationships are established via the second argument to `appendMap()`.
This method searches through the `_mirror` array to find the corresponding
mirror index for the given offset.

#### Parameters

| Parameter | Type     | Description                                                                                                   |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| `offset`  | `number` | The offset (index) of the step map to find the mirror for. This should be a valid index in the `_maps` array. |

#### Returns

`number`

The offset of the mirroring step map, or `undefined` if no mirror
relationship exists for the given offset.

#### Example

```typescript
const mapping = new Mapping();
mapping.appendMap(deleteMap); // index 0
mapping.appendMap(insertMap, 0); // index 1, mirrors index 0
mapping.getMirror(0); // Returns 1
mapping.getMirror(1); // Returns 0
```

---

### invert()

```ts
invert(): Mapping;
```

Defined in: [packages/transform/src/change-map/Mapping.ts:311](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-map/Mapping.ts#L311)

Create an inverted version of this mapping.

The inverted mapping contains the same step maps in reverse order, with each
step map inverted. This allows mapping positions backward through a series of
transformations. Mirror relationships are preserved in the inverted mapping.

#### Returns

`Mapping`

A new Mapping that is the inverse of this one, which can be used to
map positions from the transformed document back to the original.

#### Example

```typescript
const mapping = new Mapping();
mapping.appendMap(new StepMap([2, 0, 4])); // Insert 4 chars at pos 2
const inverted = mapping.invert();

const pos = mapping.map(5); // Returns 9
const original = inverted.map(pos); // Returns 5 (back to original)
```

---

### map()

```ts
map(pos, assoc?): number;
```

Defined in: [packages/transform/src/change-map/Mapping.ts:339](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-map/Mapping.ts#L339)

Map a position through this mapping.

Applies all step maps in the active range (from `from` to `to`) in sequence
to transform the position. If mirror relationships exist, uses the more complex
`_map()` method for recovery. Otherwise, uses a simple sequential mapping.

#### Parameters

| Parameter | Type     | Default value | Description                                                                                                                                                                                                                                 |
| --------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pos`     | `number` | `undefined`   | The position to map through the transformation pipeline.                                                                                                                                                                                    |
| `assoc`   | `number` | `1`           | The association side determining behavior at insertion boundaries. Use `-1` to associate with the left side (position stays before insertions), or `1` to associate with the right side (position moves after insertions). Defaults to `1`. |

#### Returns

`number`

The mapped position after applying all transformations in the range.

#### Example

```typescript
const mapping = new Mapping([new StepMap([2, 0, 4])]); // Insert 4 at pos 2
mapping.map(5, 1); // Returns 9 (5 + 4)
mapping.map(2, 1); // Returns 6 (after insertion)
mapping.map(2, -1); // Returns 2 (before insertion)
```

#### Implementation of

```ts
Mappable.map;
```

---

### mapResult()

```ts
mapResult(pos, assoc?): MapResult;
```

Defined in: [packages/transform/src/change-map/Mapping.ts:375](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-map/Mapping.ts#L375)

Map a position through this mapping, returning a MapResult with detailed information.

Unlike the simple `map()` method, this returns a MapResult object that includes
information about whether content was deleted at the mapped position and provides
recovery values for handling mirrored steps.

#### Parameters

| Parameter | Type     | Default value | Description                                                                                                                                                                                                                                 |
| --------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pos`     | `number` | `undefined`   | The position to map through the transformation pipeline.                                                                                                                                                                                    |
| `assoc`   | `number` | `1`           | The association side determining behavior at insertion boundaries. Use `-1` to associate with the left side (position stays before insertions), or `1` to associate with the right side (position moves after insertions). Defaults to `1`. |

#### Returns

`MapResult`

A MapResult object containing: - `pos`: The mapped position - `delInfo`: Bitwise flags indicating deletion information - `deleted`, `deletedBefore`, `deletedAfter`, `deletedAcross`: Boolean flags - `recover`: Recovery value for mirrored steps (if applicable)

#### Example

```typescript
const mapping = new Mapping([new StepMap([2, 4, 0])]); // Delete 4 chars at pos 2
const result = mapping.mapResult(4, 1);
console.log(result.pos); // Mapped position
console.log(result.deleted); // true if position was deleted
```

#### Implementation of

```ts
Mappable.mapResult;
```

---

### setMirror()

```ts
setMirror(offset, mirrorOffset): void;
```

Defined in: [packages/transform/src/change-map/Mapping.ts:284](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-map/Mapping.ts#L284)

Register a mirroring relationship between two step maps.

This indicates that the step map at `mirrorOffset` is the inverse of the step map
at `offset`. Mirror relationships are bidirectional - if A mirrors B, then B mirrors A.
This information is used during position mapping to recover positions that would
otherwise be lost when mapping through deleted content.

#### Parameters

| Parameter      | Type     | Description                                                                                                              |
| -------------- | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| `offset`       | `number` | The offset (index) of the first step map in the mirror relationship.                                                     |
| `mirrorOffset` | `number` | The offset (index) of the mirroring step map. This step map should be the inverse operation of the step map at `offset`. |

#### Returns

`void`

#### Example

```typescript
const mapping = new Mapping();
mapping.appendMap(deleteMap); // index 0
mapping.appendMap(insertMap); // index 1
mapping.setMirror(0, 1); // Establish mirror relationship
// Now getMirror(0) returns 1, and getMirror(1) returns 0
```

---

### slice()

```ts
slice(from?, to?): Mapping;
```

Defined in: [packages/transform/src/change-map/Mapping.ts:167](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-map/Mapping.ts#L167)

Create a mapping that maps only through a part of this one.

This creates a new mapping that shares the same underlying step map array
but operates on a different range. This is efficient as it doesn't copy
the maps themselves, only creates a new view into them.

#### Parameters

| Parameter | Type     | Default value | Description                                                                      |
| --------- | -------- | ------------- | -------------------------------------------------------------------------------- |
| `from`    | `number` | `0`           | The starting index (inclusive) of the slice range. Defaults to 0.                |
| `to`      | `number` | `...`         | The ending index (exclusive) of the slice range. Defaults to `this.maps.length`. |

#### Returns

`Mapping`

A new Mapping that only maps through step maps in the range `[from, to)`.

#### Example

```typescript
const mapping = new Mapping([map1, map2, map3, map4]);
// Create a slice that only uses map2 and map3
const sliced = mapping.slice(1, 3);
```
