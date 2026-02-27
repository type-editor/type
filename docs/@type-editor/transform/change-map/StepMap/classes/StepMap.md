[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [change-map/StepMap](../README.md) / StepMap

# Class: StepMap

Defined in: [packages/transform/src/change-map/StepMap.ts:23](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-map/StepMap.ts#L23)

A map describing the deletions and insertions made by a step, which
can be used to find the correspondence between positions in the
pre-step version of a document and the same position in the
post-step version.
\<br/\>
This class uses recovery values.
Recovery values encode a range index and an offset. They are
represented as numbers, because tons of them will be created when
mapping, for example, a large number of decorations. The number's
lower 16 bits provide the index, the remaining bits the offset.

Note: We intentionally don't use bit shift operators to en- and
decode these, since those clip to 32 bits, which we might in rare
cases want to overflow. A 64-bit float can represent 48-bit
integers precisely.

## Implements

- `PmStepMap`

## Constructors

### Constructor

```ts
new StepMap(ranges, inverted?): StepMap;
```

Defined in: [packages/transform/src/change-map/StepMap.ts:52](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-map/StepMap.ts#L52)

Create a position map. The modifications to the document are
represented as an array of numbers, in which each group of three
represents a modified chunk as `[start, oldSize, newSize]`.

#### Parameters

| Parameter  | Type                | Default value | Description                                                                                                                    |
| ---------- | ------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `ranges`   | readonly `number`[] | `undefined`   | Array of numbers representing modified chunks as [start, oldSize, newSize] triplets. The array length must be a multiple of 3. |
| `inverted` | `boolean`           | `false`       | Whether this is an inverted map (default: false).                                                                              |

#### Returns

`StepMap`

#### Throws

If the ranges array length is not a multiple of 3.

## Properties

| Property                            | Modifier | Type      | Description                                | Defined in                                                                                                                                                                            |
| ----------------------------------- | -------- | --------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-empty"></a> `empty` | `static` | `StepMap` | A StepMap that contains no changed ranges. | [packages/transform/src/change-map/StepMap.ts:28](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-map/StepMap.ts#L28) |

## Methods

### forEach()

```ts
forEach(callbackFunc): void;
```

Defined in: [packages/transform/src/change-map/StepMap.ts:171](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-map/StepMap.ts#L171)

Calls the given function on each of the changed ranges included in
this map.

#### Parameters

| Parameter      | Type                                                   | Description                                                               |
| -------------- | ------------------------------------------------------ | ------------------------------------------------------------------------- |
| `callbackFunc` | (`oldStart`, `oldEnd`, `newStart`, `newEnd`) => `void` | Function called for each range with (oldStart, oldEnd, newStart, newEnd). |

#### Returns

`void`

#### Implementation of

```ts
PmStepMap.forEach;
```

---

### invert()

```ts
invert(): StepMap;
```

Defined in: [packages/transform/src/change-map/StepMap.ts:195](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-map/StepMap.ts#L195)

Create an inverted version of this map. The result can be used to
map positions in the post-step document to the pre-step document.

#### Returns

`StepMap`

An inverted StepMap.

#### Implementation of

```ts
PmStepMap.invert;
```

---

### map()

```ts
map(pos, assoc?): number;
```

Defined in: [packages/transform/src/change-map/StepMap.ts:131](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-map/StepMap.ts#L131)

Map a position through this step map.

#### Parameters

| Parameter | Type     | Default value | Description                                                                                                         |
| --------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------- |
| `pos`     | `number` | `undefined`   | The position to map.                                                                                                |
| `assoc`   | `number` | `1`           | Determines which side the position is associated with. Use -1 for the left side, 1 for the right side (default: 1). |

#### Returns

`number`

The mapped position.

#### Implementation of

```ts
PmStepMap.map;
```

---

### mapResult()

```ts
mapResult(pos, assoc?): MapResult;
```

Defined in: [packages/transform/src/change-map/StepMap.ts:119](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-map/StepMap.ts#L119)

Map a position through this step map, returning a MapResult object
with additional information about the mapping, including whether
content was deleted and recovery information.

#### Parameters

| Parameter | Type     | Default value | Description                                                                                                         |
| --------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------- |
| `pos`     | `number` | `undefined`   | The position to map.                                                                                                |
| `assoc`   | `number` | `1`           | Determines which side the position is associated with. Use -1 for the left side, 1 for the right side (default: 1). |

#### Returns

`MapResult`

A MapResult containing the mapped position and deletion info.

#### Implementation of

```ts
PmStepMap.mapResult;
```

---

### recover()

```ts
recover(value): number;
```

Defined in: [packages/transform/src/change-map/StepMap.ts:89](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-map/StepMap.ts#L89)

Recover a position that was deleted by this step map, using a recovery value
obtained from a previous mapping. Returns the pre-deletion position
corresponding to the given recovery value.

#### Parameters

| Parameter | Type     | Description                          |
| --------- | -------- | ------------------------------------ |
| `value`   | `number` | The recovery value from a MapResult. |

#### Returns

`number`

The recovered position in the document.

#### Throws

If the recovery value references an invalid range index.

#### Implementation of

```ts
PmStepMap.recover;
```

---

### toString()

```ts
toString(): string;
```

Defined in: [packages/transform/src/change-map/StepMap.ts:205](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-map/StepMap.ts#L205)

Returns a string representation of this step map.
Inverted maps are prefixed with a minus sign.

#### Returns

`string`

A JSON string representation of the ranges, optionally prefixed with '-'.

#### Implementation of

```ts
PmStepMap.toString;
```

---

### touches()

```ts
touches(pos, recover): boolean;
```

Defined in: [packages/transform/src/change-map/StepMap.ts:143](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-map/StepMap.ts#L143)

Test whether the given position touches the range with the
given recover value.

#### Parameters

| Parameter | Type     | Description                               |
| --------- | -------- | ----------------------------------------- |
| `pos`     | `number` | The position to test.                     |
| `recover` | `number` | The recovery value identifying the range. |

#### Returns

`boolean`

True if the position touches the range, false otherwise.

#### Implementation of

```ts
PmStepMap.touches;
```

---

### offset()

```ts
static offset(offset): StepMap;
```

Defined in: [packages/transform/src/change-map/StepMap.ts:76](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-map/StepMap.ts#L76)

Create a map that moves all positions by offset `n` (which may be
negative). This can be useful when applying steps meant for a
sub-document to a larger document, or vice-versa.

#### Parameters

| Parameter | Type     | Description                                          |
| --------- | -------- | ---------------------------------------------------- |
| `offset`  | `number` | The number of positions to offset (can be negative). |

#### Returns

`StepMap`

A StepMap that offsets all positions by the given amount.
