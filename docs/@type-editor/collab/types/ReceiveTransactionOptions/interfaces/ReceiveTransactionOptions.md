[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/collab](../../../README.md) / [types/ReceiveTransactionOptions](../README.md) / ReceiveTransactionOptions

# Interface: ReceiveTransactionOptions

Defined in: [types/ReceiveTransactionOptions.ts:5](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/collab/src/types/ReceiveTransactionOptions.ts#L5)

Configuration options for receiving transactions from the central authority.

## Properties

| Property                                                           | Type      | Description                                                                                                                                                                                                                                                                                                          | Defined in                                                                                                                                                                            |
| ------------------------------------------------------------------ | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-mapselectionbackward"></a> `mapSelectionBackward?` | `boolean` | When enabled (the default is `false`), if the current selection is a TextSelection, its sides are mapped with a negative bias for this transaction, so that content inserted at the cursor ends up after the cursor. Users usually prefer this, but it isn't done by default for reasons of backwards compatibility. | [types/ReceiveTransactionOptions.ts:14](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/collab/src/types/ReceiveTransactionOptions.ts#L14) |
