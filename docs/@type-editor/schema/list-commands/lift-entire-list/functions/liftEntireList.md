[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/schema](../../../README.md) / [list-commands/lift-entire-list](../README.md) / liftEntireList

# Function: liftEntireList()

```ts
function liftEntireList(state, dispatch, enclosingList): boolean;
```

Defined in: [list-commands/lift-entire-list.ts:24](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/schema/src/list-commands/lift-entire-list.ts#L24)

Lifts an entire list out, unwrapping all list items.

This function creates a NodeRange covering ALL list items in the enclosing list,
then lifts them all out at once. If the list is nested inside another list,
the items become items of the outer list. If it's a top-level list, the items
are unwrapped back to regular blocks.

## Parameters

| Parameter       | Type               | Description                                                            |
| --------------- | ------------------ | ---------------------------------------------------------------------- |
| `state`         | `PmEditorState`    | The current editor state                                               |
| `dispatch`      | `DispatchFunction` | Optional dispatch function to execute the transaction                  |
| `enclosingList` | `FindParentResult` | The result from findParentByType containing the list node and position |

## Returns

`boolean`

True if the lift operation is possible/successful, false otherwise
