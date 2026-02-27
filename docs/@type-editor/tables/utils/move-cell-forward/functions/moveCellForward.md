[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/move-cell-forward](../README.md) / moveCellForward

# Function: moveCellForward()

```ts
function moveCellForward($pos): ResolvedPos;
```

Defined in: [tables/src/utils/move-cell-forward.ts:22](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/tables/src/utils/move-cell-forward.ts#L22)

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
