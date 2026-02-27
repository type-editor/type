[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/move-row](../README.md) / moveRow

# Function: moveRow()

```ts
function moveRow(params): boolean;
```

Defined in: [tables/src/utils/move-row.ts:74](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/tables/src/utils/move-row.ts#L74)

Moves a table row from one position to another within the same table.

This function handles complex scenarios including:

- Moving rows that are part of merged cells (rowspan)
- Preserving cell content and attributes during the move
- Optionally selecting the moved row after the operation

The function will fail (return `false`) if:

- The position is not within a table
- Either the origin or target row cannot be resolved
- The target row is part of the same merged cell group as the origin row

## Parameters

| Parameter | Type                                              | Description                                |
| --------- | ------------------------------------------------- | ------------------------------------------ |
| `params`  | [`MoveRowParams`](../interfaces/MoveRowParams.md) | The parameters for the row move operation. |

## Returns

`boolean`

`true` if the row was successfully moved, `false` otherwise.

## Example

```typescript
// Move row at index 2 to position 0 (top of table)
const success = moveRow({
  tr: state.transaction,
  originIndex: 2,
  targetIndex: 0,
  select: true,
  pos: tablePos,
});
```
