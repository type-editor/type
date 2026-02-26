[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/commands](../README.md) / delete-selection

# delete-selection

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

[deleteSelection](variables/deleteSelection.md)

</td>
<td>

Deletes the current selection if one exists.

This command removes all content within the current selection range. If the selection
is empty (just a cursor position), the command returns `false` and does nothing.
After deletion, the view is scrolled to keep the cursor visible.

This is typically used as the first command in a chain for delete operations, allowing
more specific deletion behaviors to take over when there's no selection.

**Param**

The current editor state

**Param**

Optional dispatch function to execute the transaction

**Example**

```typescript
// Use as part of a delete key handler
const keymap = {
  Backspace: chainCommands(deleteSelection, joinBackward),
  Delete: chainCommands(deleteSelection, joinForward),
};
```

</td>
</tr>
</tbody>
</table>
