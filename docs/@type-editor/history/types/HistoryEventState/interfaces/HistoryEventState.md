[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/history](../../../README.md) / [types/HistoryEventState](../README.md) / HistoryEventState

# Interface: HistoryEventState

Defined in: [types/HistoryEventState.ts:10](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/history/src/types/HistoryEventState.ts#L10)

Represents the state of a history event during undo/redo operations.

## Properties

| Property                                    | Type                                                | Description                                  | Defined in                                                                                                                                                             |
| ------------------------------------------- | --------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-remaining"></a> `remaining` | [`Branch`](../../../state/Branch/classes/Branch.md) | The remaining branch after popping the event | [types/HistoryEventState.ts:12](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/history/src/types/HistoryEventState.ts#L12) |
| <a id="property-selection"></a> `selection` | `SelectionBookmark`                                 | The selection bookmark to restore            | [types/HistoryEventState.ts:16](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/history/src/types/HistoryEventState.ts#L16) |
| <a id="property-transform"></a> `transform` | `Transaction`                                       | The transaction containing the event steps   | [types/HistoryEventState.ts:14](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/history/src/types/HistoryEventState.ts#L14) |
