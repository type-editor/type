[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/commands](../README.md) / newline-in-code

# newline-in-code

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

[newlineInCode](variables/newlineInCode.md)

</td>
<td>

Inserts a newline character when inside a code block.

This command allows inserting literal newline characters ("\n") within code blocks,
as opposed to the default Enter key behavior which typically creates new block nodes.
This is essential for maintaining proper code formatting where newlines are part of
the content rather than structural elements.

The command only works when:

- The selection is within a node marked as code (via `NodeSpec.code`)
- The selection head and anchor are in the same parent (not spanning blocks)

This is typically bound to the Enter key for code blocks, allowing users to
naturally add new lines within their code.

**Param**

The current editor state

**Param**

Optional dispatch function to execute the transaction

**Example**

```typescript
// Use in a keymap to handle Enter in code blocks
const keymap = {
  Enter: chainCommands(newlineInCode, exitCode, splitBlock),
};

// Bind Shift-Enter to always insert newlines in code
const keymap = {
  "Shift-Enter": newlineInCode,
};
```

</td>
</tr>
</tbody>
</table>
