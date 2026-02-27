[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/move-row-in-array-of-rows](../README.md) / moveRowInArrayOfRows

# Function: moveRowInArrayOfRows()

```ts
function moveRowInArrayOfRows<T>(
  rows,
  indexesOrigin,
  indexesTarget,
  directionOverride,
): T[];
```

Defined in: [tables/src/utils/move-row-in-array-of-rows.ts:42](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/tables/src/utils/move-row-in-array-of-rows.ts#L42)

Moves one or more consecutive elements from the origin position to a target position
within an array of rows. Supports both single and multi-row operations.

The function handles complex scenarios including:

- Moving a single row up or down
- Moving multiple consecutive rows (e.g., merged cells spanning multiple rows)
- Direction overrides for precise positioning control

## Type Parameters

| Type Parameter | Description                             |
| -------------- | --------------------------------------- |
| `T`            | The type of elements in the rows array. |

## Parameters

| Parameter           | Type                                                | Description                                                                                                                                                                              |
| ------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `rows`              | `T`[]                                               | The array of rows to modify. This array is mutated in place.                                                                                                                             |
| `indexesOrigin`     | `number`[]                                          | Array of consecutive indexes to move. For merged cells, this contains all row indexes that are part of the span.                                                                         |
| `indexesTarget`     | `number`[]                                          | Array of target indexes. Used to determine the insertion point.                                                                                                                          |
| `directionOverride` | [`MoveDirection`](../type-aliases/MoveDirection.md) | Controls the insertion position relative to the target: - `-1`: Insert before the target position - `0`: Use natural direction based on movement - `1`: Insert after the target position |

## Returns

`T`[]

The modified array (same reference as the input array).

## Example

```typescript
// Moving a single row down
const rows = [0, 1, 2, 3, 4];
moveRowInArrayOfRows(rows, [1], [3], 0);
// Result: [0, 2, 3, 1, 4]

// Moving multiple consecutive rows up
const rows2 = [0, 1, 2, 3, 4, 5];
moveRowInArrayOfRows(rows2, [4, 5], [1, 2], 0);
// Result: [0, 4, 5, 1, 2, 3]
```
