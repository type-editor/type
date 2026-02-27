[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [commands/move-table-column](../README.md) / moveTableColumn

# Function: moveTableColumn()

```ts
function moveTableColumn(options): Command;
```

Defined in: [tables/src/commands/move-table-column.ts:14](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/tables/src/commands/move-table-column.ts#L14)

Creates a command that moves a table column from one index to another.

## Parameters

| Parameter | Type                                                                                                            | Description                                 |
| --------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `options` | [`MoveTableColumnOptions`](../../../types/commands/MoveTableColumnOptions/interfaces/MoveTableColumnOptions.md) | Configuration for the column move operation |

## Returns

`Command`

A command that moves the specified column
