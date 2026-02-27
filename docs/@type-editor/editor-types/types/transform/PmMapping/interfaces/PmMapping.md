[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/editor-types](../../../../README.md) / [types/transform/PmMapping](../README.md) / PmMapping

# Interface: PmMapping

Defined in: [packages/editor-types/src/types/transform/PmMapping.ts:4](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/transform/PmMapping.ts#L4)

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

## Properties

| Property                                    | Modifier   | Type                                                                        | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Inherited from                                                                                                              | Defined in                                                                                                                                                                                              |
| ------------------------------------------- | ---------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-map"></a> `map`             | `public`   | (`pos`, `assoc?`) => `number`                                               | Map a position through this object, returning the transformed position. This is the primary method for tracking how a position changes through a document transformation. The `assoc` parameter controls behavior when content is inserted exactly at the position being mapped. **Example** `const insertMap = new StepMap([10, 0, 5]); // Insert 5 chars at position 10 insertMap.map(10, 1); // Returns 15 (moves after insertion) insertMap.map(10, -1); // Returns 10 (stays before insertion) insertMap.map(15, 1); // Returns 20 (shifted by insertion)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | [`Mappable`](../../Mappable/interfaces/Mappable.md).[`map`](../../Mappable/interfaces/Mappable.md#property-map)             | [packages/editor-types/src/types/transform/Mappable.ts:51](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/transform/Mappable.ts#L51) |
| <a id="property-mapresult"></a> `mapResult` | `public`   | (`pos`, `assoc?`) => [`MapResult`](../../MapResult/interfaces/MapResult.md) | Map a position and return detailed information about the mapping result. Unlike the simple `map()` method, this returns a comprehensive result object that includes the mapped position plus information about whether content was deleted, and recovery values for handling mirrored transformations. The `deleted` field indicates whether the position was completely enclosed in a replaced or deleted range. When content on only one side is deleted, the position is only considered deleted when `assoc` points toward the deleted content. **Example** `const deleteMap = new StepMap([5, 10, 0]); // Delete 10 chars at position 5 // Position in deleted range const result1 = deleteMap.mapResult(8, 1); console.log(result1.pos); // 5 (maps to deletion start) console.log(result1.deleted); // true console.log(result1.deletedAcross); // true // Position at deletion boundary const result2 = deleteMap.mapResult(5, -1); console.log(result2.pos); // 5 console.log(result2.deleted); // false (assoc points away) console.log(result2.deletedAfter); // true` | [`Mappable`](../../Mappable/interfaces/Mappable.md).[`mapResult`](../../Mappable/interfaces/Mappable.md#property-mapresult) | [packages/editor-types/src/types/transform/Mappable.ts:97](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/transform/Mappable.ts#L97) |
| <a id="property-maps"></a> `maps`           | `readonly` | readonly [`PmStepMap`](../../PmStepMap/interfaces/PmStepMap.md)[]           | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | -                                                                                                                           | [packages/editor-types/src/types/transform/PmMapping.ts:6](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/transform/PmMapping.ts#L6) |

## Methods

### appendMap()

```ts
appendMap(map, mirrors?): void;
```

Defined in: [packages/editor-types/src/types/transform/PmMapping.ts:10](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/transform/PmMapping.ts#L10)

#### Parameters

| Parameter  | Type                                                   |
| ---------- | ------------------------------------------------------ |
| `map`      | [`PmStepMap`](../../PmStepMap/interfaces/PmStepMap.md) |
| `mirrors?` | `number`                                               |

#### Returns

`void`

---

### appendMapping()

```ts
appendMapping(mapping): void;
```

Defined in: [packages/editor-types/src/types/transform/PmMapping.ts:12](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/transform/PmMapping.ts#L12)

#### Parameters

| Parameter | Type        |
| --------- | ----------- |
| `mapping` | `PmMapping` |

#### Returns

`void`

---

### getMirror()

```ts
getMirror(offset): number;
```

Defined in: [packages/editor-types/src/types/transform/PmMapping.ts:14](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/transform/PmMapping.ts#L14)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `offset`  | `number` |

#### Returns

`number`

---

### invert()

```ts
invert(): PmMapping;
```

Defined in: [packages/editor-types/src/types/transform/PmMapping.ts:18](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/transform/PmMapping.ts#L18)

#### Returns

`PmMapping`

---

### setMirror()

```ts
setMirror(offset, mirrorOffset): void;
```

Defined in: [packages/editor-types/src/types/transform/PmMapping.ts:16](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/transform/PmMapping.ts#L16)

#### Parameters

| Parameter      | Type     |
| -------------- | -------- |
| `offset`       | `number` |
| `mirrorOffset` | `number` |

#### Returns

`void`

---

### slice()

```ts
slice(from?, to?): PmMapping;
```

Defined in: [packages/editor-types/src/types/transform/PmMapping.ts:8](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/transform/PmMapping.ts#L8)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `from?`   | `number` |
| `to?`     | `number` |

#### Returns

`PmMapping`
