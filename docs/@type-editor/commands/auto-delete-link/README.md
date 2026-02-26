[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/commands](../README.md) / auto-delete-link

# auto-delete-link

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

[autoDeleteLink](functions/autoDeleteLink.md)

</td>
<td>

Creates a command that removes link marks from the current selection or cursor position.

If the cursor is positioned within a link (empty selection), the command will automatically
extend the selection to cover the entire linked text range before removing the link mark.
If there's an active selection, it removes the link mark from the entire selected range.

**Example**

```typescript
// Remove link at cursor position or from selection
const command = autoDeleteLink();
command(editorState, dispatch);

// Use with custom mark type
const customCommand = autoDeleteLink(customLinkMarkType);
```

</td>
</tr>
</tbody>
</table>
