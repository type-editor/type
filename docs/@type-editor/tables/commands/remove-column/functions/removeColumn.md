[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [commands/remove-column](../README.md) / removeColumn

# Function: removeColumn()

```ts
function removeColumn(transaction, tableRect, col): void;
```

Defined in: [tables/src/commands/remove-column.ts:21](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/commands/remove-column.ts#L21)

Removes a column at the specified position from a table.

This function handles:

- Reducing colspan for cells that span across the removed column
- Deleting cells that only occupy the removed column
- Properly updating position mappings during the operation

## Parameters

| Parameter     | Type                                                                       | Description                                               |
| ------------- | -------------------------------------------------------------------------- | --------------------------------------------------------- |
| `transaction` | `PmTransaction`                                                            | The transaction to apply changes to                       |
| `tableRect`   | [`TableRect`](../../../types/commands/TableRect/type-aliases/TableRect.md) | The table rectangle containing map, table, and tableStart |
| `col`         | `number`                                                                   | The column index to remove                                |

## Returns

`void`
