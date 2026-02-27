[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/history](../../../README.md) / [helper/close-history](../README.md) / closeHistory

# Function: closeHistory()

```ts
function closeHistory(transaction): Transaction;
```

Defined in: [helper/close-history.ts:15](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/history/src/helper/close-history.ts#L15)

Sets a flag on the given transaction that prevents further steps from being
appended to an existing history event.

This forces subsequent changes to be recorded as a separate history event,
requiring a separate undo command to revert.

## Parameters

| Parameter     | Type          | Description                                                  |
| ------------- | ------------- | ------------------------------------------------------------ |
| `transaction` | `Transaction` | The transaction to mark as closing the current history event |

## Returns

`Transaction`

The modified transaction with the close history flag set
