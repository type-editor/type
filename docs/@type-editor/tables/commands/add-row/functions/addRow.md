[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [commands/add-row](../README.md) / addRow

# Function: addRow()

```ts
function addRow(transaction, tableRect, row): PmTransaction;
```

Defined in: [tables/src/commands/add-row.ts:23](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/commands/add-row.ts#L23)

Adds a row at the given position in a table.

This function handles:

- Extending cells that span across the insertion point via rowspan
- Creating new cells with the appropriate type (header or regular)
- Maintaining table structure integrity

## Parameters

| Parameter     | Type                                                                       | Description                                               |
| ------------- | -------------------------------------------------------------------------- | --------------------------------------------------------- |
| `transaction` | `PmTransaction`                                                            | The transaction to apply changes to                       |
| `tableRect`   | [`TableRect`](../../../types/commands/TableRect/type-aliases/TableRect.md) | The table rectangle containing map, tableStart, and table |
| `row`         | `number`                                                                   | The row index where the new row should be inserted        |

## Returns

`PmTransaction`

The modified transaction
