[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/convert](../README.md) / convertTableNodeToArrayOfRows

# Function: convertTableNodeToArrayOfRows()

```ts
function convertTableNodeToArrayOfRows(tableNode): TableCellMatrix;
```

Defined in: [tables/src/utils/convert.ts:43](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/utils/convert.ts#L43)

Transforms a table node into a matrix of rows and columns, respecting merged cells.

For cells spanning multiple rows or columns, only the top-left cell of the merged
region contains the actual Node; all other positions in the span are represented
as `null`.

## Parameters

| Parameter   | Type     | Description                                            |
| ----------- | -------- | ------------------------------------------------------ |
| `tableNode` | `Node_2` | The table node to convert into a matrix representation |

## Returns

[`TableCellMatrix`](../type-aliases/TableCellMatrix.md)

A 2D array where each row contains nodes or null values for merged cell continuations

## Example

Given this table structure:

```
┌──────┬──────┬─────────────┐
│  A1  │  B1  │     C1      │
├──────┼──────┴──────┬──────┤
│  A2  │     B2      │      │
├──────┼─────────────┤  D1  │
│  A3  │  B3  │  C3  │      │
└──────┴──────┴──────┴──────┘
```

The result will be:

```javascript
[
  [A1, B1, C1, null], // C1 spans 2 columns, so position 3 is null
  [A2, B2, null, D1], // B2 spans 2 columns, D1 starts here but spans 2 rows
  [A3, B3, C3, null], // D1 continues from above, so position 3 is null
];
```
