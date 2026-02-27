[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [fixtables/fix-table](../README.md) / fixTable

# Function: fixTable()

```ts
function fixTable(state, table, tablePos, transaction): PmTransaction;
```

Defined in: [tables/src/fixtables/fix-table.ts:22](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/tables/src/fixtables/fix-table.ts#L22)

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
