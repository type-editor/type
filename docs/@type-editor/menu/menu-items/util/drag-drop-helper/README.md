[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/menu](../../../README.md) / menu-items/util/drag-drop-helper

# menu-items/util/drag-drop-helper

## Interfaces

<table>
<thead>
<tr>
<th>Interface</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[DragDropListenerOptions](interfaces/DragDropListenerOptions.md)

</td>
<td>

Options for configuring drag-drop listeners.

</td>
</tr>
</tbody>
</table>

## Variables

<table>
<thead>
<tr>
<th>Variable</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[COMMON_ELEMENT_IDS](variables/COMMON_ELEMENT_IDS.md)

</td>
<td>

Common element IDs used across file upload dialogs.
These IDs are shared between image-item and file-upload-item.

</td>
</tr>
</tbody>
</table>

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

[createDropZoneHtml](functions/createDropZoneHtml.md)

</td>
<td>

Creates HTML for a drop zone with file input.

</td>
</tr>
<tr>
<td>

[extractFilesFromDropEvent](functions/extractFilesFromDropEvent.md)

</td>
<td>

Extracts File objects from a drop event.

</td>
</tr>
<tr>
<td>

[getFileItemsFromDragEvent](functions/getFileItemsFromDragEvent.md)

</td>
<td>

Extracts file items from a drag event.

</td>
</tr>
<tr>
<td>

[hasImageFiles](functions/hasImageFiles.md)

</td>
<td>

Checks if any file item is an image.

</td>
</tr>
<tr>
<td>

[setupDragDropListeners](functions/setupDragDropListeners.md)

</td>
<td>

Sets up drag-and-drop event listeners for file uploads.

This function configures:

- Window-level drop prevention to avoid accidental file opens
- Drop zone handlers for drag-and-drop file uploads
- Dragover handlers for visual feedback during drag operations

</td>
</tr>
</tbody>
</table>
