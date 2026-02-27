[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/tables](../../../../README.md) / [input/util/maybe-set-selection](../README.md) / maybeSetSelection

# Function: maybeSetSelection()

```ts
function maybeSetSelection(state, dispatch, selection): boolean;
```

Defined in: [tables/src/input/util/maybe-set-selection.ts:13](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/input/util/maybe-set-selection.ts#L13)

Conditionally sets a new selection if it differs from the current one.

## Parameters

| Parameter   | Type               | Description                                          |
| ----------- | ------------------ | ---------------------------------------------------- |
| `state`     | `PmEditorState`    | The current editor state.                            |
| `dispatch`  | `DispatchFunction` | Optional dispatch function to apply the transaction. |
| `selection` | `PmSelection`      | The new selection to set.                            |

## Returns

`boolean`

`true` if the selection was changed (or would be changed), `false` otherwise.
