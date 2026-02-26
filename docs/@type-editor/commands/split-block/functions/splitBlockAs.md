[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [split-block](../README.md) / splitBlockAs

# Function: splitBlockAs()

```ts
function splitBlockAs(splitNode?): Command;
```

Defined in: [split-block.ts:84](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/commands/src/split-block.ts#L84)

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

## Parameters

| Parameter    | Type                                                        | Description                                              |
| ------------ | ----------------------------------------------------------- | -------------------------------------------------------- |
| `splitNode?` | [`SplitNodeFunction`](../type-aliases/SplitNodeFunction.md) | Optional function to determine the type of the new block |

## Returns

`Command`

A command that performs the block split

## Example

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
