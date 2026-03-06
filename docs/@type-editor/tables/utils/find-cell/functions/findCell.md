[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/find-cell](../README.md) / findCell

# Function: findCell()

```ts
function findCell($pos): Rect;
```

Defined in: [tables/src/utils/find-cell.ts:22](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/utils/find-cell.ts#L22)

Finds the rectangular bounds of the cell at the given position.

Uses the table map to determine the cell's position in the table grid,
accounting for any rowspan or colspan that may affect its bounds.

## Parameters

| Parameter | Type          | Description                                       |
| --------- | ------------- | ------------------------------------------------- |
| `$pos`    | `ResolvedPos` | A resolved position pointing at or within a cell. |

## Returns

[`Rect`](../../../types/tablemap/Rect/interfaces/Rect.md)

A rectangle describing the cell's bounds in the table grid.

## Example

```typescript
const rect = findCell($cellPos);
console.log(`Cell spans from column ${rect.left} to ${rect.right}`);
```
