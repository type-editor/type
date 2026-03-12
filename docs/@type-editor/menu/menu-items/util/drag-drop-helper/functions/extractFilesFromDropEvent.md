[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/menu](../../../../README.md) / [menu-items/util/drag-drop-helper](../README.md) / extractFilesFromDropEvent

# Function: extractFilesFromDropEvent()

```ts
function extractFilesFromDropEvent(dragEvent): File[];
```

Defined in: [packages/menu/src/menu-items/util/drag-drop-helper.ts:36](https://github.com/type-editor/type/blob/99c78b8d1f93eef5c6a5bbfe09ed0a72a4c9ab4c/packages/menu/src/menu-items/util/drag-drop-helper.ts#L36)

Extracts File objects from a drop event.

## Parameters

| Parameter   | Type        | Description                          |
| ----------- | ----------- | ------------------------------------ |
| `dragEvent` | `DragEvent` | The drag event to extract files from |

## Returns

`File`[]

Array of File objects (null values filtered out)
