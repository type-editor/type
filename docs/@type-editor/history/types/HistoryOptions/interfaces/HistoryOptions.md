[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/history](../../../README.md) / [types/HistoryOptions](../README.md) / HistoryOptions

# Interface: HistoryOptions

Defined in: [types/HistoryOptions.ts:2](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/history/src/types/HistoryOptions.ts#L2)

## Properties

| Property                                             | Type     | Description                                                                                                                                                                 | Defined in                                                                                                                                                       |
| ---------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-depth"></a> `depth?`                 | `number` | The amount of history events that are collected before the oldest events are discarded. Defaults to 100.                                                                    | [types/HistoryOptions.ts:8](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/history/src/types/HistoryOptions.ts#L8)   |
| <a id="property-newgroupdelay"></a> `newGroupDelay?` | `number` | The delay between changes after which a new group should be started. Defaults to 500 (milliseconds). Note that when changes aren't adjacent, a new group is always started. | [types/HistoryOptions.ts:15](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/history/src/types/HistoryOptions.ts#L15) |
