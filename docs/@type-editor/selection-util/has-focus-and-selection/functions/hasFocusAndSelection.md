[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/selection-util](../../README.md) / [has-focus-and-selection](../README.md) / hasFocusAndSelection

# Function: hasFocusAndSelection()

```ts
function hasFocusAndSelection(view): boolean;
```

Defined in: [has-focus-and-selection.ts:15](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/selection-util/src/selection/has-focus-and-selection.ts#L15)

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
