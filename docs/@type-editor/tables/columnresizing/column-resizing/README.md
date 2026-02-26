[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / columnresizing/column-resizing

# columnresizing/column-resizing

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

[columnResizing](functions/columnResizing.md)

</td>
<td>

Creates a plugin that allows users to resize table columns by dragging the edges
of column cells. The plugin provides visual feedback via decorations and updates
the column width attributes in the document.

**Example**

```typescript
const plugins = [
  columnResizing({
    handleWidth: 5,
    cellMinWidth: 25,
    lastColumnResizable: true,
  }),
  // ... other plugins
];
```

</td>
</tr>
</tbody>
</table>
