[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [skip-ignored-nodes](../README.md) / skipIgnoredNodesAfter

# Function: skipIgnoredNodesAfter()

```ts
function skipIgnoredNodesAfter(_state, _dispatch, view): boolean;
```

Defined in: [skip-ignored-nodes.ts:130](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/commands/src/skip-ignored-nodes.ts#L130)

Ensures the cursor isn't directly before one or more ignored nodes.

This function traverses forward from the current cursor position to find
and skip over any zero-size nodes that should be invisible to the user.

## Parameters

| Parameter   | Type               | Description             |
| ----------- | ------------------ | ----------------------- |
| `_state`    | `PmEditorState`    | -                       |
| `_dispatch` | `DispatchFunction` | -                       |
| `view`      | `PmEditorView`     | The EditorView instance |

## Returns

`boolean`

True if the selection was adjusted
