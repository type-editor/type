[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/column-is-header](../README.md) / columnIsHeader

# Function: columnIsHeader()

```ts
function columnIsHeader(map, table, col): boolean;
```

Defined in: [tables/src/utils/column-is-header.ts:26](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/utils/column-is-header.ts#L26)

Checks if an entire column consists only of header cells.

This function iterates through all rows of the table and checks if
every cell in the specified column is a header cell.

## Parameters

| Parameter | Type                                                         | Description                               |
| --------- | ------------------------------------------------------------ | ----------------------------------------- |
| `map`     | [`TableMap`](../../../tablemap/TableMap/classes/TableMap.md) | The TableMap for the table being checked. |
| `table`   | `Node_2`                                                     | The table node to check.                  |
| `col`     | `number`                                                     | The zero-based column index to check.     |

## Returns

`boolean`

True if all cells in the column are header cells, false otherwise.

## Example

```typescript
const map = TableMap.get(tableNode);
if (columnIsHeader(map, tableNode, 0)) {
  console.log("First column is a header column");
}
```
