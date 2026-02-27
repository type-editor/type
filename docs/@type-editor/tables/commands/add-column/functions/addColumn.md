[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [commands/add-column](../README.md) / addColumn

# Function: addColumn()

```ts
function addColumn(transaction, tableRect, col): PmTransaction;
```

Defined in: [tables/src/commands/add-column.ts:25](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/tables/src/commands/add-column.ts#L25)

Adds a column at the given position in a table.

This function handles:

- Extending cells that span across the insertion point
- Creating new cells with the appropriate type (header or regular)
- Maintaining table structure integrity

## Parameters

| Parameter     | Type                                                                       | Description                                               |
| ------------- | -------------------------------------------------------------------------- | --------------------------------------------------------- |
| `transaction` | `PmTransaction`                                                            | The transaction to apply changes to                       |
| `tableRect`   | [`TableRect`](../../../types/commands/TableRect/type-aliases/TableRect.md) | The table rectangle containing map, tableStart, and table |
| `col`         | `number`                                                                   | The column index where the new column should be inserted  |

## Returns

`PmTransaction`

The modified transaction
