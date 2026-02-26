[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/get-cells](../README.md) / getCellsInColumn

# Function: getCellsInColumn()

```ts
function getCellsInColumn(columnIndex, selection): FindNodeResult[];
```

Defined in: [tables/src/utils/get-cells.ts:61](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/utils/get-cells.ts#L61)

Returns an array of cells in a column at the specified column index.

This function locates the table containing the current selection and retrieves
all cells that belong to the specified column. The returned cells include
their positions and node references for further manipulation.

## Parameters

| Parameter     | Type          | Description                                                                                                    |
| ------------- | ------------- | -------------------------------------------------------------------------------------------------------------- |
| `columnIndex` | `number`      | The zero-based index of the column to retrieve cells from. Must be within the valid range [0, tableWidth - 1]. |
| `selection`   | `PmSelection` | The current editor selection, used to locate the table context.                                                |

## Returns

[`FindNodeResult`](../../query/interfaces/FindNodeResult.md)[]

An array of cell information objects if the column exists, or undefined
if no table is found or the column index is out of bounds.

## Example

```typescript
const cells = getCellsInColumn(0, editorState.selection);
if (cells) {
  cells.forEach((cell) => console.log(cell.node.textContent));
}
```
