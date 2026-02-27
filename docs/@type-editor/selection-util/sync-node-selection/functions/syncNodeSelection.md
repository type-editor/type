[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/selection-util](../../README.md) / [sync-node-selection](../README.md) / syncNodeSelection

# Function: syncNodeSelection()

```ts
function syncNodeSelection(view, sel): void;
```

Defined in: [sync-node-selection.ts:15](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/selection-util/src/selection/sync-node-selection.ts#L15)

Synchronizes node selection state between ProseMirror and the DOM.

When a node is selected (as opposed to text selection), this function ensures
that the appropriate view descriptor is marked as selected, and any previously
selected node is deselected. This allows node views to apply custom styling
or behavior when selected.

## Parameters

| Parameter | Type           | Description                       |
| --------- | -------------- | --------------------------------- |
| `view`    | `PmEditorView` | The editor view                   |
| `sel`     | `PmSelection`  | The current ProseMirror selection |

## Returns

`void`
