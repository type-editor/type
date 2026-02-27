[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [commands/row-is-header](../README.md) / rowIsHeader

# Function: rowIsHeader()

```ts
function rowIsHeader(map, table, row): boolean;
```

Defined in: [tables/src/commands/row-is-header.ts:15](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/tables/src/commands/row-is-header.ts#L15)

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
