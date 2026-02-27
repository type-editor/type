[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/get-cells](../README.md) / getCellsInRow

# Function: getCellsInRow()

```ts
function getCellsInRow(rowIndex, selection): FindNodeResult[];
```

Defined in: [tables/src/utils/get-cells.ts:102](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/tables/src/utils/get-cells.ts#L102)

Returns an array of cells in a row at the specified row index.

This function locates the table containing the current selection and retrieves
all cells that belong to the specified row. The returned cells include
their positions and node references for further manipulation.

## Parameters

| Parameter   | Type          | Description                                                                                                  |
| ----------- | ------------- | ------------------------------------------------------------------------------------------------------------ |
| `rowIndex`  | `number`      | The zero-based index of the row to retrieve cells from. Must be within the valid range [0, tableHeight - 1]. |
| `selection` | `PmSelection` | The current editor selection, used to locate the table context.                                              |

## Returns

[`FindNodeResult`](../../query/interfaces/FindNodeResult.md)[]

An array of cell information objects if the row exists, or undefined
if no table is found or the row index is out of bounds.

## Example

```typescript
const cells = getCellsInRow(0, editorState.selection);
if (cells) {
  cells.forEach((cell) => console.log(cell.node.textContent));
}
```
