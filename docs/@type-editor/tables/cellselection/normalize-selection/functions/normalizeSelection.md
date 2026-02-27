[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [cellselection/normalize-selection](../README.md) / normalizeSelection

# Function: normalizeSelection()

```ts
function normalizeSelection(
  state,
  transaction,
  allowTableNodeSelection,
): PmTransaction;
```

Defined in: [tables/src/cellselection/normalize-selection.ts:29](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/cellselection/normalize-selection.ts#L29)

Normalizes table-related selections to ensure consistent behavior.

This function handles several edge cases:

- Converts node selections on cells to CellSelection
- Converts node selections on rows to full row CellSelection
- Converts node selections on tables to select all cells (if not allowed)
- Normalizes selections at cell boundaries to collapsed selections
- Normalizes text selections spanning multiple cells to stay within the first cell

## Parameters

| Parameter                 | Type            | Description                                             |
| ------------------------- | --------------- | ------------------------------------------------------- |
| `state`                   | `PmEditorState` | The current editor state.                               |
| `transaction`             | `PmTransaction` | The optional transaction to apply the normalization to. |
| `allowTableNodeSelection` | `boolean`       | Whether to allow node selection of the entire table.    |

## Returns

`PmTransaction`

The transaction with the normalized selection, or `undefined` if no normalization was needed.
