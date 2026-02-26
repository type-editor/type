[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/commands](../README.md) / exit-code

# exit-code

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

[exitCode](variables/exitCode.md)

</td>
<td>

Creates a default block after a code block and moves the cursor there.

This command allows users to "exit" from a code block by creating a new default
block (typically a paragraph) immediately after the code block and positioning
the cursor at the start of it. This is particularly useful when the cursor is at
the end of a code block and the user wants to continue editing outside of it.

The command only works when:

- The selection is within a node marked as code (via `NodeSpec.code`)
- The selection is not spanning multiple parents
- A suitable default block type can be inserted after the code block

**Param**

The current editor state

**Param**

Optional dispatch function to execute the transaction

**Example**

```typescript
// Bind to Mod-Enter to allow easy exit from code blocks
const keymap = {
  "Mod-Enter": exitCode,
};

// Or use with chainCommands for fallback behavior
const keymap = {
  Enter: chainCommands(exitCode, splitBlock),
};
```

</td>
</tr>
</tbody>
</table>
