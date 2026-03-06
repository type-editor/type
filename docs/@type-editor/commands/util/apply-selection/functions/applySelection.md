[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/commands](../../../README.md) / [util/apply-selection](../README.md) / applySelection

# Function: applySelection()

```ts
function applySelection(view, selection): boolean;
```

Defined in: [util/apply-selection.ts:11](https://github.com/type-editor/type/blob/70862bf5e8a5266dfb443941f265014c48842b41/packages/commands/src/util/apply-selection.ts#L11)

Applies a new selection to the editor view.

## Parameters

| Parameter   | Type           | Description             |
| ----------- | -------------- | ----------------------- |
| `view`      | `PmEditorView` | The EditorView instance |
| `selection` | `PmSelection`  | The selection to apply  |

## Returns

`boolean`

Always returns true to indicate the event was handled
