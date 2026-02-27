[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [commands/move-table-column](../README.md) / moveTableColumn

# Function: moveTableColumn()

```ts
function moveTableColumn(options): Command;
```

Defined in: [tables/src/commands/move-table-column.ts:14](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/commands/move-table-column.ts#L14)

Creates a command that moves a table column from one index to another.

## Parameters

| Parameter | Type                                                                                                            | Description                                 |
| --------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `options` | [`MoveTableColumnOptions`](../../../types/commands/MoveTableColumnOptions/interfaces/MoveTableColumnOptions.md) | Configuration for the column move operation |

## Returns

`Command`

A command that moves the specified column
