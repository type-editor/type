[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [commands/row-is-header](../README.md) / rowIsHeader

# Function: rowIsHeader()

```ts
function rowIsHeader(map, table, row): boolean;
```

Defined in: [tables/src/commands/row-is-header.ts:15](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/commands/row-is-header.ts#L15)

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
