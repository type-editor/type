[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/query](../README.md) / findCellPos

# Function: findCellPos()

```ts
function findCellPos(doc, pos): ResolvedPos;
```

Defined in: [tables/src/utils/query.ts:187](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/utils/query.ts#L187)

Finds the resolved position of a table cell at or near the given document position.

This function first attempts to find a cell that directly contains the position
using [cellAround](../../cell-around/functions/cellAround.md). If no containing cell is found, it searches for a
nearby cell using [cellNear](../../cell-near/functions/cellNear.md).

## Parameters

| Parameter | Type     | Description                           |
| --------- | -------- | ------------------------------------- |
| `doc`     | `Node_2` | The document node to search within.   |
| `pos`     | `number` | The document position to search from. |

## Returns

`ResolvedPos`

The resolved position pointing to the cell, or `undefined` if no cell
is found at or near the position.

## Example

```typescript
const $cell = findCellPos(state.doc, clickPosition);
if ($cell) {
  console.log("Found cell at position:", $cell.pos);
  console.log("Cell node:", $cell.nodeAfter);
}
```
