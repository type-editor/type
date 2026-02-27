[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [skip-ignored-nodes](../README.md) / skipIgnoredNodesBefore

# Function: skipIgnoredNodesBefore()

```ts
function skipIgnoredNodesBefore(_state, _dispatch, view): boolean;
```

Defined in: [skip-ignored-nodes.ts:41](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/commands/src/skip-ignored-nodes.ts#L41)

Ensures the cursor isn't directly after one or more ignored nodes,
which would confuse the browser's cursor motion logic.

This function traverses backward from the current cursor position to find
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
