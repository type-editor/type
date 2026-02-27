[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/selection-util](../../README.md) / [has-focus-and-selection](../README.md) / hasFocusAndSelection

# Function: hasFocusAndSelection()

```ts
function hasFocusAndSelection(view): boolean;
```

Defined in: [has-focus-and-selection.ts:15](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/selection-util/src/selection/has-focus-and-selection.ts#L15)

Checks if the editor both has focus and contains a selection.

For editable views, this requires the view to have focus.
For all views, this checks if a valid selection exists within the editor.

## Parameters

| Parameter | Type           | Description              |
| --------- | -------------- | ------------------------ |
| `view`    | `PmEditorView` | The editor view to check |

## Returns

`boolean`

True if the view has focus (when editable) and contains a selection
