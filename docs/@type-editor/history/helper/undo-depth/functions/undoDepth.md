[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/history](../../../README.md) / [helper/undo-depth](../README.md) / undoDepth

# Function: undoDepth()

```ts
function undoDepth(state): number;
```

Defined in: [helper/undo-depth.ts:21](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/history/src/helper/undo-depth.ts#L21)

Returns the number of undoable events available in the editor's history.

This can be used to determine whether the undo command is available,
or to display the undo history depth in the UI.

## Parameters

| Parameter | Type            | Description              |
| --------- | --------------- | ------------------------ |
| `state`   | `PmEditorState` | The current editor state |

## Returns

`number`

The number of undoable events, or 0 if no history is available

## Example

```typescript
const canUndo = undoDepth(state) > 0;
console.log(`You can undo ${undoDepth(state)} changes`);
```
