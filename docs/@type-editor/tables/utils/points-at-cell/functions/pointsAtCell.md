[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/points-at-cell](../README.md) / pointsAtCell

# Function: pointsAtCell()

```ts
function pointsAtCell($pos): boolean;
```

Defined in: [tables/src/utils/points-at-cell.ts:20](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/utils/points-at-cell.ts#L20)

Checks if the given position points directly at a cell.

A position "points at" a cell when its parent is a table row
and there is a node immediately after the position.

## Parameters

| Parameter | Type          | Description                     |
| --------- | ------------- | ------------------------------- |
| `$pos`    | `ResolvedPos` | The resolved position to check. |

## Returns

`boolean`

True if the position points at a cell, false otherwise.

## Example

```typescript
if (pointsAtCell($pos)) {
  const cell = $pos.nodeAfter;
  // Process the cell...
}
```
