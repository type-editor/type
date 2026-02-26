[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / input/handle-paste

# input/handle-paste

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

[handlePaste](functions/handlePaste.md)

</td>
<td>

Handles paste events within table cells.

This function handles two scenarios:

1. When pasting into a cell selection, it clips the pasted content to fit
   the selected area and inserts cells appropriately.
2. When pasting table-like content into a single cell, it expands the
   table if necessary to accommodate the pasted cells.

**Example**

```typescript
// Use in a ProseMirror plugin
new Plugin({
  props: {
    handlePaste: handlePaste,
  },
});
```

</td>
</tr>
</tbody>
</table>
