[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/commands](../../../README.md) / [util/helpers](../README.md) / deleteBarrier

# Function: deleteBarrier()

```ts
function deleteBarrier(state, $cut, dispatch, direction): boolean;
```

Defined in: [util/helpers.ts:471](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/commands/src/util/helpers.ts#L471)

Attempts to delete or join nodes separated by a structural barrier.

This is a complex function that implements multiple strategies for handling
deletion or joining when there's a structural barrier (like different node types
or isolating nodes) between content. It tries several approaches in order:

1. **Simple Join**: Try basic joining if nodes are compatible
2. **Wrap and Merge**: Wrap the after node to make it compatible, then merge
3. **Lift**: Lift the after content up in the hierarchy
4. **Join Textblocks**: Find and join inner textblocks across the barrier

This function is used by backward and forward joining commands to handle
complex structural scenarios that simple joining can't handle.

## Parameters

| Parameter   | Type               | Description                                             |
| ----------- | ------------------ | ------------------------------------------------------- |
| `state`     | `PmEditorState`    | The current editor state                                |
| `$cut`      | `ResolvedPos`      | The position where the barrier exists                   |
| `dispatch`  | `DispatchFunction` | Optional dispatch function to execute the transaction   |
| `direction` | `number`           | Direction of operation (-1 for backward, 1 for forward) |

## Returns

`boolean`

`true` if any strategy succeeded, `false` otherwise
