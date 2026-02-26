[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / columnresizing/column-resizing-plugin-key

# columnresizing/column-resizing-plugin-key

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

[columnResizingPluginKey](variables/columnResizingPluginKey.md)

</td>
<td>

Plugin key for accessing the column resizing plugin state.
Use this key to retrieve the current [ResizeState](../ResizeState/classes/ResizeState.md) from the editor state.

**Example**

```typescript
const resizeState = columnResizingPluginKey.getState(editorState);
if (resizeState?.dragging) {
  // Handle active drag operation
}
```

</td>
</tr>
</tbody>
</table>
