[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/history](../../../README.md) / [plugin/apply-transaction](../README.md) / applyTransaction

# Function: applyTransaction()

```ts
function applyTransaction(history, state, transaction, options): HistoryState;
```

Defined in: [plugin/apply-transaction.ts:40](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/history/src/plugin/apply-transaction.ts#L40)

Applies a transaction to the history state, updating the undo/redo stacks appropriately.

## Parameters

| Parameter     | Type                                                                                             | Description                   |
| ------------- | ------------------------------------------------------------------------------------------------ | ----------------------------- |
| `history`     | [`HistoryState`](../../../state/HistoryState/classes/HistoryState.md)                            | The current history state     |
| `state`       | `PmEditorState`                                                                                  | The current editor state      |
| `transaction` | `PmTransaction`                                                                                  | The transaction to apply      |
| `options`     | `Required`&lt;[`HistoryOptions`](../../../types/HistoryOptions/interfaces/HistoryOptions.md)&gt; | History configuration options |

## Returns

[`HistoryState`](../../../state/HistoryState/classes/HistoryState.md)

The updated history state
