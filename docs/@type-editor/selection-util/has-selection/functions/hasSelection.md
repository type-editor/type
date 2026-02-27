[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/selection-util](../../README.md) / [has-selection](../README.md) / hasSelection

# Function: hasSelection()

```ts
function hasSelection(view): boolean;
```

Defined in: [has-selection.ts:20](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/selection-util/src/selection/has-selection.ts#L20)

Checks if the editor contains a valid DOM selection.

This function verifies that:

1. An anchor node exists in the selection
2. The anchor node is within the editor DOM
3. For non-editable views, the focus node is also within the editor DOM

Text nodes (nodeType === 3) are checked via their parent element.
This is wrapped in a try-catch because Firefox throws 'permission denied'
errors when accessing properties of nodes in generated CSS elements.

## Parameters

| Parameter | Type           | Description              |
| --------- | -------------- | ------------------------ |
| `view`    | `PmEditorView` | The editor view to check |

## Returns

`boolean`

True if a valid selection exists within the editor
