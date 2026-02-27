[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/convert](../README.md) / convertArrayOfRowsToTableNode

# Function: convertArrayOfRowsToTableNode()

```ts
function convertArrayOfRowsToTableNode(tableNode, cellMatrix): Node_2;
```

Defined in: [tables/src/utils/convert.ts:173](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/tables/src/utils/convert.ts#L173)

Converts a matrix of table cells back into a table node.

This function reconstructs a table node from a 2D array representation,
typically used after modifying the table structure or cell contents.
The matrix should follow the same format produced by [convertTableNodeToArrayOfRows](convertTableNodeToArrayOfRows.md),
where `null` values represent continuation cells of merged regions.

## Parameters

| Parameter    | Type                           | Description                                                                                                                                                               |
| ------------ | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tableNode`  | `Node_2`                       | The original table node used as a template for structure and attributes. Row and cell types are preserved from this node.                                                 |
| `cellMatrix` | readonly readonly `Node_2`[][] | A 2D array of cells where each element is either: - A Node representing a cell (original or modified) - `null` for merged cell continuations (colspan/rowspan extensions) |

## Returns

`Node_2`

A new table node with the updated cell contents while preserving the original structure

## Example

```typescript
const originalTable = table(tr(td("A1"), td("B1")), tr(td("A2"), td("B2")));
const matrix = convertTableNodeToArrayOfRows(originalTable);

// Modify a cell in the matrix
matrix[0][0] = createNewCell("Modified A1");

// Convert back to a table node
const newTable = convertArrayOfRowsToTableNode(originalTable, matrix);
```
