[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/in-same-table](../README.md) / inSameTable

# Function: inSameTable()

```ts
function inSameTable($cellA, $cellB): boolean;
```

Defined in: [tables/src/utils/in-same-table.ts:22](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/utils/in-same-table.ts#L22)

Checks if two cell positions are within the same table.

Two cells are considered to be in the same table if they have the same
depth and the first cell's position is within the bounds of the second
cell's parent table.

## Parameters

| Parameter | Type          | Description                               |
| --------- | ------------- | ----------------------------------------- |
| `$cellA`  | `ResolvedPos` | The resolved position of the first cell.  |
| `$cellB`  | `ResolvedPos` | The resolved position of the second cell. |

## Returns

`boolean`

True if both cells are in the same table, false otherwise.

## Example

```typescript
if (inSameTable($anchorCell, $headCell)) {
  // Create a cell selection spanning these cells
}
```
