[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/move-column](../README.md) / moveColumn

# Function: moveColumn()

```ts
function moveColumn(moveColParams): boolean;
```

Defined in: [tables/src/utils/move-column.ts:59](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/tables/src/utils/move-column.ts#L59)

Moves a column from the origin index to the target index within a table.

This function handles column movement by:

1. Finding the table at the given position
2. Determining the full range of columns to move (accounting for merged cells)
3. Performing the move operation by transposing the table, moving rows, and transposing back
4. Optionally selecting the moved column

## Parameters

| Parameter       | Type                                                    | Description                                   |
| --------------- | ------------------------------------------------------- | --------------------------------------------- |
| `moveColParams` | [`MoveColumnParams`](../interfaces/MoveColumnParams.md) | The parameters for the column move operation. |

## Returns

`boolean`

`true` if the column was successfully moved, `false` otherwise.
