[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/selection-range](../README.md) / getSelectionRangeInColumn

# Function: getSelectionRangeInColumn()

```ts
function getSelectionRangeInColumn(
  transaction,
  startColIndex,
  endColIndex?,
): CellSelectionRange;
```

Defined in: [tables/src/utils/selection-range.ts:333](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/utils/selection-range.ts#L333)

Returns a range of rectangular selection spanning all merged cells around a
column at the specified index.

This function calculates the complete selection range needed to select entire
columns, taking into account cells that span multiple columns. When a cell
spans across the selection boundary, the selection is automatically expanded
to include all columns covered by that cell.

Original implementation from Atlassian (Apache License 2.0)

## Parameters

| Parameter       | Type            | Default value   | Description                                                                                                                                                                     |
| --------------- | --------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `transaction`   | `PmTransaction` | `undefined`     | The ProseMirror transaction containing the current document state and selection information.                                                                                    |
| `startColIndex` | `number`        | `undefined`     | The zero-based index of the first column to include in the selection. Must be a non-negative integer.                                                                           |
| `endColIndex`   | `number`        | `startColIndex` | The zero-based index of the last column to include in the selection. Defaults to `startColIndex` for single-column selection. Must be greater than or equal to `startColIndex`. |

## Returns

[`CellSelectionRange`](../interfaces/CellSelectionRange.md)

A [CellSelectionRange](../interfaces/CellSelectionRange.md) object containing the anchor and head positions
for the selection, along with all column indexes included. Returns `undefined`
if the selection cannot be determined (e.g., invalid indexes or no table found).

## See

https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/5f91cb871e8248bc3bae5ddc30bb9fd9200fadbb/editor/editor-tables/src/utils/get-selection-range-in-column.ts

## Example

```typescript
// Select a single column
const range = getSelectionRangeInColumn(tr, 2);

// Select multiple columns
const multiRange = getSelectionRangeInColumn(tr, 1, 3);

if (range) {
  const cellSelection = CellSelection.create(
    tr.doc,
    range.$anchor.pos,
    range.$head.pos,
  );
  tr.setSelection(cellSelection);
}
```
