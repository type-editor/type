[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/menu](../../../README.md) / [menu-items/file-upload-item](../README.md) / fileUploadItem

# Function: fileUploadItem()

```ts
function fileUploadItem(title?, fileType?, codeBlockNodeType?): MenuItem;
```

Defined in: [packages/menu/src/menu-items/file-upload-item.ts:96](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/menu-items/file-upload-item.ts#L96)

Creates a menu item for uploading and managing file attachments in the editor.

This menu item provides functionality to:

- Upload new files via file picker or drag-and-drop
- Generate thumbnail previews for supported file types (images, PDFs)
- Update existing file attachments
- Download attached files

When the selection is empty, files are inserted as thumbnail previews (if available)
or as text links. When text is selected, the file mark is applied to the selection.

## Parameters

| Parameter           | Type       | Default value             | Description                                                                                                     |
| ------------------- | ---------- | ------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `title`             | `string`   | `'File Upload'`           | The display title for the menu item. Defaults to 'File Upload'.                                                 |
| `fileType`          | `MarkType` | `schema.marks.file`       | The mark type used for file attachments. Defaults to `schema.marks.file`.                                       |
| `codeBlockNodeType` | `NodeType` | `schema.nodes.code_block` | The node type for code blocks (used to disable the item in code blocks). Defaults to `schema.nodes.code_block`. |

## Returns

[`MenuItem`](../../../menubar/MenuItem/classes/MenuItem.md)

A configured MenuItem instance for file uploads.

## Example

```typescript
import { fileUploadItem } from "@type-editor/menu";

const menuItem = fileUploadItem("Attach File");
```
