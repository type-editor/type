[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/history](../../../README.md) / [helper/redo-depth](../README.md) / redoDepth

# Function: redoDepth()

```ts
function redoDepth(state): number;
```

Defined in: [helper/redo-depth.ts:21](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/history/src/helper/redo-depth.ts#L21)

Returns the number of redoable events available in the editor's history.

This can be used to determine whether the redo command is available,
or to display the redo history depth in the UI.

## Parameters

| Parameter | Type            | Description              |
| --------- | --------------- | ------------------------ |
| `state`   | `PmEditorState` | The current editor state |

## Returns

`number`

The number of redoable events, or 0 if no redo history is available

## Example

```typescript
const canRedo = redoDepth(state) > 0;
console.log(`You can redo ${redoDepth(state)} changes`);
```
