[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [split-block](../README.md) / splitBlock

# Variable: splitBlock

```ts
const splitBlock: Command;
```

Defined in: [split-block.ts:33](https://github.com/type-editor/type/blob/70862bf5e8a5266dfb443941f265014c48842b41/packages/commands/src/split-block.ts#L33)

Standard command to split the parent block at the selection.

This is the default block splitting command, typically bound to the Enter key.
It deletes any selected content and splits the current block, creating a new
block of an appropriate type.

## Example

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
