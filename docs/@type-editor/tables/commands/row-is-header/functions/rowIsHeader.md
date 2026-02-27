[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [commands/row-is-header](../README.md) / rowIsHeader

# Function: rowIsHeader()

```ts
function rowIsHeader(map, table, row): boolean;
```

Defined in: [tables/src/commands/row-is-header.ts:15](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/tables/src/commands/row-is-header.ts#L15)

Checks if all cells in a given row are header cells.

## Parameters

| Parameter | Type                                                         | Description            |
| --------- | ------------------------------------------------------------ | ---------------------- |
| `map`     | [`TableMap`](../../../tablemap/TableMap/classes/TableMap.md) | The table map to check |
| `table`   | `Node_2`                                                     | The table node         |
| `row`     | `number`                                                     | The row index to check |

## Returns

`boolean`

True if all cells in the row are header cells
