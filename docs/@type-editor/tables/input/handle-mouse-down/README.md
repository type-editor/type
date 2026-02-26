[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / input/handle-mouse-down

# input/handle-mouse-down

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

[handleMouseDown](functions/handleMouseDown.md)

</td>
<td>

Handles mouse down events for table cell selection.

This handler enables cell selection by dragging across table cells.
It supports:

- Shift+click to extend an existing cell selection
- Click and drag to create a new cell selection
- Ignores right-click and Ctrl/Cmd+click

**Example**

```typescript
// Use in a ProseMirror plugin
new Plugin({
  props: {
    handleDOMEvents: {
      mousedown: handleMouseDown,
    },
  },
});
```

</td>
</tr>
</tbody>
</table>
