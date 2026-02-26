[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / input/handle-key-down

# input/handle-key-down

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

[handleKeyDown](variables/handleKeyDown.md)

</td>
<td>

Keydown handler for table-related keyboard shortcuts.

Handles the following key bindings:

- Arrow keys: Navigate between cells.
- Shift+Arrow keys: Extend cell selection.
- Backspace/Delete: Delete selected cells' content.

**Example**

```typescript
// Use in a ProseMirror plugin
new Plugin({
  props: {
    handleKeyDown: handleKeyDown,
  },
});
```

</td>
</tr>
</tbody>
</table>
