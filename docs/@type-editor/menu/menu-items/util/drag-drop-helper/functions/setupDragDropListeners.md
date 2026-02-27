[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/menu](../../../../README.md) / [menu-items/util/drag-drop-helper](../README.md) / setupDragDropListeners

# Function: setupDragDropListeners()

```ts
function setupDragDropListeners(options): void;
```

Defined in: [packages/menu/src/menu-items/util/drag-drop-helper.ts:76](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/menu/src/menu-items/util/drag-drop-helper.ts#L76)

Sets up drag-and-drop event listeners for file uploads.

This function configures:

- Window-level drop prevention to avoid accidental file opens
- Drop zone handlers for drag-and-drop file uploads
- Dragover handlers for visual feedback during drag operations

## Parameters

| Parameter | Type                                                                  | Description                                       |
| --------- | --------------------------------------------------------------------- | ------------------------------------------------- |
| `options` | [`DragDropListenerOptions`](../interfaces/DragDropListenerOptions.md) | Configuration options for the drag-drop listeners |

## Returns

`void`
