[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/menu](../../../../README.md) / [menu-items/util/drag-drop-helper](../README.md) / createDropZoneHtml

# Function: createDropZoneHtml()

```ts
function createDropZoneHtml(
  dropZoneId,
  fileInputId,
  labelText,
  accept,
  multiple?,
): string;
```

Defined in: [packages/menu/src/menu-items/util/drag-drop-helper.ts:128](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menu-items/util/drag-drop-helper.ts#L128)

Creates HTML for a drop zone with file input.

## Parameters

| Parameter     | Type      | Default value | Description                                         |
| ------------- | --------- | ------------- | --------------------------------------------------- |
| `dropZoneId`  | `string`  | `undefined`   | The ID for the drop zone label element              |
| `fileInputId` | `string`  | `undefined`   | The ID for the file input element                   |
| `labelText`   | `string`  | `undefined`   | The text to display in the drop zone                |
| `accept`      | `string`  | `undefined`   | The accepted file types (e.g., 'image/\*', '\*/\*') |
| `multiple`    | `boolean` | `false`       | Whether to allow multiple file selection            |

## Returns

`string`

HTML string for the drop zone
