[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/collab](../../README.md) / [receive-transaction](../README.md) / receiveTransaction

# Function: receiveTransaction()

```ts
function receiveTransaction(state, steps, clientIDs, options?): PmTransaction;
```

Defined in: [receive-transaction.ts:29](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/collab/src/receive-transaction.ts#L29)

Creates a transaction that represents a set of new steps received from
the central authority. Applying this transaction moves the state forward
to adjust to the authority's view of the document.

This function handles three scenarios:

1. Steps that originated from this client are confirmed and removed from unconfirmed.
2. Steps from other clients are applied directly if there are no local changes.
3. If there are local unconfirmed changes, they are rebased over the remote steps.

## Parameters

| Parameter   | Type                                                                                                         | Description                                                                                          |
| ----------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `state`     | `PmEditorState`                                                                                              | The current editor state.                                                                            |
| `steps`     | readonly `PmStep`[]                                                                                          | The steps received from the central authority.                                                       |
| `clientIDs` | readonly (`string` \| `number`)[]                                                                            | The client IDs corresponding to each step, used to identify which steps originated from this client. |
| `options`   | [`ReceiveTransactionOptions`](../../types/ReceiveTransactionOptions/interfaces/ReceiveTransactionOptions.md) | Optional configuration for how to handle the transaction.                                            |

## Returns

`PmTransaction`

A transaction that applies the received steps and updates the collab state.
