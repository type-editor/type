[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/move-cell-forward](../README.md) / moveCellForward

# Function: moveCellForward()

```ts
function moveCellForward($pos): ResolvedPos;
```

Defined in: [tables/src/utils/move-cell-forward.ts:22](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/utils/move-cell-forward.ts#L22)

Moves a position forward past the current cell.

This function assumes the position points at a cell (see pointsAtCell)
and returns a new resolved position after that cell.

## Parameters

| Parameter | Type          | Description                               |
| --------- | ------------- | ----------------------------------------- |
| `$pos`    | `ResolvedPos` | The resolved position pointing at a cell. |

## Returns

`ResolvedPos`

A new resolved position after the cell.

## Example

```typescript
let $cellPos = getFirstCellPos(table);
while (pointsAtCell($cellPos)) {
  processCell($cellPos.nodeAfter);
  $cellPos = moveCellForward($cellPos);
}
```
