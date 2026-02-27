[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [commands/selected-rect](../README.md) / selectedRect

# Function: selectedRect()

```ts
function selectedRect(state): TableRect;
```

Defined in: [tables/src/commands/selected-rect.ts:21](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/commands/selected-rect.ts#L21)

Gets the selected rectangular region in a table.

This helper function determines the selection bounds and adds table map,
table node, and table start offset to the result for convenience.

## Parameters

| Parameter | Type            | Description              |
| --------- | --------------- | ------------------------ |
| `state`   | `PmEditorState` | The current editor state |

## Returns

[`TableRect`](../../../types/commands/TableRect/type-aliases/TableRect.md)

A TableRect containing the selection bounds and table context

## Throws

Error if not within a table (use isInTable() first)
