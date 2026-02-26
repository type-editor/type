[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/commands](../README.md) / select-all

# select-all

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

[selectAll](variables/selectAll.md)

</td>
<td>

Selects the entire document.

This command creates an AllSelection that encompasses the entire document content.
It's typically bound to Ctrl-A/Cmd-A to provide standard "Select All" functionality.

Unlike some commands, this one always returns `true` because it can always be
executed (there's always a document to select).

**Param**

The current editor state

**Param**

Optional dispatch function to execute the transaction

**Example**

```typescript
// Bind to the standard Select All shortcut
const keymap = {
  "Mod-a": selectAll,
};

// Use programmatically
selectAll(view.state, view.dispatch);
```

</td>
</tr>
</tbody>
</table>
