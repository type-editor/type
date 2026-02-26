[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/commands](../README.md) / join-textblock-backward

# join-textblock-backward

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

[joinTextblockBackward](variables/joinTextblockBackward.md)

</td>
<td>

Joins the current textblock with the textblock before it.

This is a more focused version of `joinBackward` that specifically handles joining
textblocks. It only works when the cursor is at the start of a textblock and attempts
to join it with the textblock before it, even if they're nested in different structures.

The command navigates down through nested structures to find the actual textblocks
to join, making it work correctly with complex document structures like nested lists
or blockquotes.

This command will fail if:

- The cursor is not at the start of a textblock
- There's no textblock before the current one
- The blocks are separated by isolating nodes
- The join operation is not structurally valid

**Param**

The current editor state

**Param**

Optional dispatch function to execute the transaction

**Param**

Optional editor view for accurate cursor position detection

**Example**

```typescript
// Use as an alternative to joinBackward for stricter textblock joining
const keymap = {
  "Shift-Backspace": joinTextblockBackward,
};
```

</td>
</tr>
</tbody>
</table>
