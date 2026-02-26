[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/commands](../README.md) / split-block

# split-block

## Type Aliases

<table>
<thead>
<tr>
<th>Type Alias</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[SplitNodeFunction](type-aliases/SplitNodeFunction.md)

</td>
<td>

Function type for customizing the node type of newly split blocks.

</td>
</tr>
</tbody>
</table>

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

[splitBlock](variables/splitBlock.md)

</td>
<td>

Standard command to split the parent block at the selection.

This is the default block splitting command, typically bound to the Enter key.
It deletes any selected content and splits the current block, creating a new
block of an appropriate type.

**Example**

```typescript
// Basic usage in keymap
const keymap = {
  Enter: splitBlock,
};

// Use with chainCommands for special cases
const keymap = {
  Enter: chainCommands(newlineInCode, exitCode, liftEmptyBlock, splitBlock),
};
```

</td>
</tr>
</tbody>
</table>

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

[splitBlockAs](functions/splitBlockAs.md)

</td>
<td>

Creates a command that splits the parent block at the selection.

This command factory creates variants of block splitting behavior, which is typically
bound to the Enter key. The command handles several scenarios:

**Node Selection**: If a block node is selected, splits before it.

**Text Selection**: Deletes the selection content and splits the block at that point,
creating a new block after the current one.

The optional `splitNode` function allows customizing the type of the newly created
block. This is useful for:

- Creating different block types based on context
- Preserving certain attributes when splitting
- Implementing custom Enter key behavior

If no custom function is provided, the command uses intelligent defaults:

- At the end of a block: creates a default textblock (usually paragraph)
- In the middle: preserves the current block type

**Example**

```typescript
// Default split behavior
const keymap = {
  Enter: splitBlock,
};

// Custom split that preserves heading level
const splitHeading = splitBlockAs((node, atEnd) => {
  if (node.type.name === "heading" && !atEnd) {
    return { type: node.type, attrs: node.attrs };
  }
  return null; // Use default behavior
});

// Split with custom logic for list items
const splitListItem = splitBlockAs((node, atEnd, $from) => {
  if (atEnd && node.type.name === "list_item") {
    return { type: schema.nodes.paragraph };
  }
  return null;
});
```

</td>
</tr>
</tbody>
</table>
