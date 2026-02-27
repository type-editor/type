[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [commands/remove-row](../README.md) / removeRow

# Function: removeRow()

```ts
function removeRow(transaction, tableRect, row): void;
```

Defined in: [tables/src/commands/remove-row.ts:21](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/commands/remove-row.ts#L21)

Removes a row at the specified position from a table.

This function handles:

- Reducing rowspan for cells that span across the removed row
- Deleting cells that only occupy the removed row
- Moving cells that start in the removed row but continue below
- Properly updating position mappings during the operation

## Parameters

| Parameter     | Type                                                                       | Description                                               |
| ------------- | -------------------------------------------------------------------------- | --------------------------------------------------------- |
| `transaction` | `PmTransaction`                                                            | The transaction to apply changes to                       |
| `tableRect`   | [`TableRect`](../../../types/commands/TableRect/type-aliases/TableRect.md) | The table rectangle containing map, table, and tableStart |
| `row`         | `number`                                                                   | The row index to remove                                   |

## Returns

`void`
