[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/commands](../../../README.md) / [util/move-selection-block](../README.md) / moveSelectionBlock

# Function: moveSelectionBlock()

```ts
function moveSelectionBlock(state, dir): Selection_2;
```

Defined in: [util/move-selection-block.ts:13](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/commands/src/util/move-selection-block.ts#L13)

Moves the selection to the next or previous block-level position.

## Parameters

| Parameter | Type            | Description                                       |
| --------- | --------------- | ------------------------------------------------- |
| `state`   | `PmEditorState` | The current editor state                          |
| `dir`     | `number`        | Direction to move: -1 for backward, 1 for forward |

## Returns

`Selection_2`

A new selection at the block boundary, or null if not possible
