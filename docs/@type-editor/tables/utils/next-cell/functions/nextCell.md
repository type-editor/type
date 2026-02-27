[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/next-cell](../README.md) / nextCell

# Function: nextCell()

```ts
function nextCell($pos, axis, dir): ResolvedPos;
```

Defined in: [tables/src/utils/next-cell.ts:23](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/tables/src/utils/next-cell.ts#L23)

Finds the next cell in a given direction along an axis.

Navigates from the current cell position to find an adjacent cell,
properly handling cells that span multiple rows or columns.

## Parameters

| Parameter | Type                  | Description                                                           |
| --------- | --------------------- | --------------------------------------------------------------------- |
| `$pos`    | `ResolvedPos`         | A resolved position pointing at or within a cell.                     |
| `axis`    | `"horiz"` \| `"vert"` | The axis to move along: 'horiz' for left/right, 'vert' for up/down.   |
| `dir`     | `number`              | The direction to move: positive for right/down, negative for left/up. |

## Returns

`ResolvedPos`

The resolved position of the next cell, or null if at the table boundary.

## Example

```typescript
const nextRight = nextCell($cellPos, "horiz", 1);
const nextUp = nextCell($cellPos, "vert", -1);
```
