[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [skip-ignored-nodes](../README.md) / skipIgnoredNodesAfter

# Function: skipIgnoredNodesAfter()

```ts
function skipIgnoredNodesAfter(_state, _dispatch, view): boolean;
```

Defined in: [skip-ignored-nodes.ts:130](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/commands/src/skip-ignored-nodes.ts#L130)

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
