[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / [table-editing-plugin](../README.md) / tableEditingPlugin

# Function: tableEditingPlugin()

```ts
function tableEditingPlugin(allowTableNodeSelection?): Plugin_2;
```

Defined in: [tables/src/table-editing-plugin.ts:36](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/tables/src/table-editing-plugin.ts#L36)

Creates a [plugin](http://prosemirror.net/docs/ref/#state.Plugin)
that, when added to an editor, enables cell-selection, handles
cell-based copy/paste, and makes sure tables stay well-formed (each
row has the same width, and cells don't overlap).

You should probably put this plugin near the end of your array of
plugins, since it handles mouse and arrow key events in tables
rather broadly, and other plugins, like the gap cursor or the
column-width dragging plugin, might want to get a turn first to
perform more specific behavior.

## Parameters

| Parameter                 | Type                                                                                       |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| `allowTableNodeSelection` | [`TableEditingOptions`](../../types/TableEditingOptions/interfaces/TableEditingOptions.md) |

## Returns

`Plugin_2`
