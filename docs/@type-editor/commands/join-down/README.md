[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/commands](../README.md) / join-down

# join-down

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

[joinDown](variables/joinDown.md)

</td>
<td>

Joins the selected block with the block below it.

This command attempts to join the selected block (or the closest ancestor block)
with its next sibling. The behavior differs based on the selection type:

- **Node Selection**: Joins at the end of the selected node if possible
- **Text Selection**: Finds the nearest joinable point after the selection

The command will fail if:

- A textblock node is selected (textblocks can't be joined this way)
- No valid join point exists after the selection
- The structure doesn't allow joining

**Param**

The current editor state

**Param**

Optional dispatch function to execute the transaction

**Example**

```typescript
// Bind to a key for joining blocks downward
const keymap = {
  "Alt-ArrowDown": joinDown,
};

// Use in a menu item
const menuItem = {
  label: "Join with block below",
  run: joinDown,
};
```

</td>
</tr>
</tbody>
</table>
