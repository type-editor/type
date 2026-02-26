[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/menu](../../../README.md) / menu-items/util/EditDialog

# menu-items/util/EditDialog

## Classes

<table>
<thead>
<tr>
<th>Class</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[EditDialog](classes/EditDialog.md)

</td>
<td>

A utility class for creating and managing modal dialogs in the editor.
Provides a fluent API for building dialog content with rows and custom HTML.
Handles both native HTML dialog elements and fallback div elements for older browsers.

**Example**

```typescript
const dialog = new EditDialog();
dialog
  .addPage("Settings")
  .add("<h2>Edit Image</h2>")
  .addRow('<label>Width:</label><input type="text" id="width" />')
  .addRow('<label>Height:</label><input type="text" id="height" />')
  .open(editorView, 400, 300);
```

</td>
</tr>
</tbody>
</table>

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

[PmDialogEventListener](interfaces/PmDialogEventListener.md)

</td>
<td>

Represents an event listener registered on a DOM element.
Used to track listeners for proper cleanup.

</td>
</tr>
</tbody>
</table>
