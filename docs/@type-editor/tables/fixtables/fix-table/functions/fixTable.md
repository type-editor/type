[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [fixtables/fix-table](../README.md) / fixTable

# Function: fixTable()

```ts
function fixTable(state, table, tablePos, transaction): PmTransaction;
```

Defined in: [tables/src/fixtables/fix-table.ts:22](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/tables/src/fixtables/fix-table.ts#L22)

Fix the given table, if necessary. Will append to the transaction
it was given, if non-null, or create a new one if necessary.

## Parameters

| Parameter     | Type            | Description                                         |
| ------------- | --------------- | --------------------------------------------------- |
| `state`       | `PmEditorState` | The current editor state                            |
| `table`       | `Node_2`        | The table node to fix                               |
| `tablePos`    | `number`        | The position of the table in the document           |
| `transaction` | `PmTransaction` | An optional existing transaction to append fixes to |

## Returns

`PmTransaction`

The transaction with fixes applied, or undefined if no fixes were needed
