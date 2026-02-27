[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [fixtables/fix-tables](../README.md) / fixTables

# Function: fixTables()

```ts
function fixTables(state, oldState?): PmTransaction;
```

Defined in: [tables/src/fixtables/fix-tables.ts:26](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/fixtables/fix-tables.ts#L26)

Inspects all tables in the given state's document and returns a
transaction that fixes any structural issues, if necessary.

When a previous known-good state is provided, only the changed parts
of the document are scanned, which improves performance for large documents.

## Parameters

| Parameter   | Type            | Description                                                                        |
| ----------- | --------------- | ---------------------------------------------------------------------------------- |
| `state`     | `PmEditorState` | The current editor state to inspect for table issues                               |
| `oldState?` | `PmEditorState` | Optional previous state used to optimize by only scanning changed document regions |

## Returns

`PmTransaction`

A transaction with the fixes applied, or undefined if no fixes
were needed
