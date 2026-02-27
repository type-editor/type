[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/history](../../../README.md) / [plugin/history-plugin](../README.md) / history

# Function: history()

```ts
function history(config?): Plugin_2;
```

Defined in: [plugin/history-plugin.ts:30](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/history/src/plugin/history-plugin.ts#L30)

Returns a plugin that enables the undo history for an editor. The
plugin will track undo and redo stacks, which can be used with the
[`undo`](#history.undo) and [`redo`](#history.redo) commands.
\<br/\>
You can set an `'addToHistory'` [metadata
property](#state.Transaction.setMeta) of `false` on a transaction
to prevent it from being rolled back by undo.

## Parameters

| Parameter | Type                                                                           | Description                                  |
| --------- | ------------------------------------------------------------------------------ | -------------------------------------------- |
| `config`  | [`HistoryOptions`](../../../types/HistoryOptions/interfaces/HistoryOptions.md) | Configuration options for the history plugin |

## Returns

`Plugin_2`

A ProseMirror plugin that manages undo/redo history
