[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/commands](../../../README.md) / [util/apply-selection](../README.md) / applySelection

# Function: applySelection()

```ts
function applySelection(view, selection): boolean;
```

Defined in: [util/apply-selection.ts:11](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/commands/src/util/apply-selection.ts#L11)

Applies a new selection to the editor view.

## Parameters

| Parameter   | Type           | Description             |
| ----------- | -------------- | ----------------------- |
| `view`      | `PmEditorView` | The EditorView instance |
| `selection` | `PmSelection`  | The selection to apply  |

## Returns

`boolean`

Always returns true to indicate the event was handled
