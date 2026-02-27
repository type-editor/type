[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [copypaste/insert-cells](../README.md) / insertCells

# Function: insertCells()

```ts
function insertCells(state, dispatch, tableStart, rect, cells): void;
```

Defined in: [tables/src/copypaste/insert-cells.ts:42](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/tables/src/copypaste/insert-cells.ts#L42)

Inserts a rectangular area of cells into a table at a specified position.

This function handles the complete process of pasting cells into a table:

1. Grows the table if necessary to accommodate the pasted cells
2. Splits any cells that span across the insertion boundaries
3. Replaces the cells in the target area with the pasted cells
4. Sets the selection to cover the newly inserted cells

The cells parameter should be obtained from pastedCells, which normalizes
clipboard content into a rectangular area.

## Parameters

| Parameter    | Type                                                       | Description                                                                                             |
| ------------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `state`      | `PmEditorState`                                            | The current editor state.                                                                               |
| `dispatch`   | `DispatchFunction`                                         | The dispatch function to apply the transaction.                                                         |
| `tableStart` | `number`                                                   | The document position where the table content starts (after the table node opening).                    |
| `rect`       | [`Rect`](../../../types/tablemap/Rect/interfaces/Rect.md)  | The target rectangle within the table, defining where to insert cells (only `top` and `left` are used). |
| `cells`      | [`Area`](../../../types/copypaste/Area/interfaces/Area.md) | The rectangular area of cells to insert (as returned by pastedCells).                                   |

## Returns

`void`

## Throws

If no table is found at the specified position.

## Example

```typescript
const cells = pastedCells(clipboardSlice);
if (cells) {
  insertCells(
    state,
    dispatch,
    tableStart,
    { left: 0, top: 0, right: 0, bottom: 0 },
    cells,
  );
}
```
