[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/editor-types](../../../../README.md) / [types/transform/PmStepMap](../README.md) / PmStepMap

# Interface: PmStepMap

Defined in: [packages/editor-types/src/types/transform/PmStepMap.ts:5](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/PmStepMap.ts#L5)

Interface for objects that can map positions through document changes.

Objects implementing this interface provide position mapping functionality,
which is essential for tracking how positions in a document correspond to
positions after transformations (insertions, deletions, replacements).

The `assoc` parameter determines position behavior at boundaries:

- When `assoc` is -1 (left), the position is associated with the content before it
- When `assoc` is 1 (right), the position is associated with the content after it
- This matters when content is inserted exactly at the position

## Example

```typescript
const stepMap = new StepMap([0, 0, 5]); // Insert 5 characters at position 0
const newPos = stepMap.map(0, 1); // Returns 5 (position moves after insertion)
const stayPos = stepMap.map(0, -1); // Returns 0 (position stays before insertion)
```

## Extends

- [`Mappable`](../../Mappable/interfaces/Mappable.md)

## Methods

### forEach()

```ts
forEach(callbackFunc): void;
```

Defined in: [packages/editor-types/src/types/transform/PmStepMap.ts:56](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/PmStepMap.ts#L56)

Calls the given function on each of the changed ranges included in
this map.

#### Parameters

| Parameter      | Type                                                   | Description                                                               |
| -------------- | ------------------------------------------------------ | ------------------------------------------------------------------------- |
| `callbackFunc` | (`oldStart`, `oldEnd`, `newStart`, `newEnd`) => `void` | Function called for each range with (oldStart, oldEnd, newStart, newEnd). |

#### Returns

`void`

---

### invert()

```ts
invert(): PmStepMap;
```

Defined in: [packages/editor-types/src/types/transform/PmStepMap.ts:64](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/PmStepMap.ts#L64)

Create an inverted version of this map. The result can be used to
map positions in the post-step document to the pre-step document.

#### Returns

`PmStepMap`

An inverted StepMap.

---

### map()

```ts
map(pos, assoc?): number;
```

Defined in: [packages/editor-types/src/types/transform/PmStepMap.ts:38](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/PmStepMap.ts#L38)

Map a position through this step map.

#### Parameters

| Parameter | Type     | Description                                                                                                         |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `pos`     | `number` | The position to map.                                                                                                |
| `assoc?`  | `number` | Determines which side the position is associated with. Use -1 for the left side, 1 for the right side (default: 1). |

#### Returns

`number`

The mapped position.

#### Overrides

```ts
Mappable.map;
```

---

### mapResult()

```ts
mapResult(pos, assoc?): MapResult;
```

Defined in: [packages/editor-types/src/types/transform/PmStepMap.ts:28](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/PmStepMap.ts#L28)

Map a position through this step map, returning a MapResult object
with additional information about the mapping, including whether
content was deleted and recovery information.

#### Parameters

| Parameter | Type     | Description                                                                                                         |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `pos`     | `number` | The position to map.                                                                                                |
| `assoc?`  | `number` | Determines which side the position is associated with. Use -1 for the left side, 1 for the right side (default: 1). |

#### Returns

[`MapResult`](../../MapResult/interfaces/MapResult.md)

A MapResult containing the mapped position and deletion info.

#### Overrides

```ts
Mappable.mapResult;
```

---

### recover()

```ts
recover(value): number;
```

Defined in: [packages/editor-types/src/types/transform/PmStepMap.ts:16](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/PmStepMap.ts#L16)

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

---

### toString()

```ts
toString(): string;
```

Defined in: [packages/editor-types/src/types/transform/PmStepMap.ts:72](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/PmStepMap.ts#L72)

Returns a string representation of this step map.
Inverted maps are prefixed with a minus sign.

#### Returns

`string`

A JSON string representation of the ranges, optionally prefixed with '-'.

---

### touches()

```ts
touches(pos, recover): boolean;
```

Defined in: [packages/editor-types/src/types/transform/PmStepMap.ts:48](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/PmStepMap.ts#L48)

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
