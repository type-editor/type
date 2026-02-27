[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [tablemap/compute-map](../README.md) / computeMap

# Function: computeMap()

```ts
function computeMap(table): TableMap;
```

Defined in: [tables/src/tablemap/compute-map.ts:41](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/tablemap/compute-map.ts#L41)

Compute a table map for the given table node.

The map is a flat array where each element represents a cell in the grid.
The value at each position is the table-relative offset of the cell that
covers that grid position. Cells with colspan/rowspan will appear multiple
times in the array.

## Parameters

| Parameter | Type     | Description                           |
| --------- | -------- | ------------------------------------- |
| `table`   | `Node_2` | The table node to compute the map for |

## Returns

[`TableMap`](../../TableMap/classes/TableMap.md)

A TableMap describing the table structure

## Throws

If the provided node is not a table
