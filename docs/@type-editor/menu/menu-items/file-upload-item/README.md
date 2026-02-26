[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/menu](../../README.md) / menu-items/file-upload-item

# menu-items/file-upload-item

## Functions

<table>
<thead>
<tr>
<th>Function</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[fileUploadItem](functions/fileUploadItem.md)

</td>
<td>

Creates a menu item for uploading and managing file attachments in the editor.

This menu item provides functionality to:

- Upload new files via file picker or drag-and-drop
- Generate thumbnail previews for supported file types (images, PDFs)
- Update existing file attachments
- Download attached files

When the selection is empty, files are inserted as thumbnail previews (if available)
or as text links. When text is selected, the file mark is applied to the selection.

**Example**

```typescript
import { fileUploadItem } from "@type-editor/menu";

const menuItem = fileUploadItem("Attach File");
```

</td>
</tr>
</tbody>
</table>
