[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [split-block](../README.md) / splitBlock

# Variable: splitBlock

```ts
const splitBlock: Command;
```

Defined in: [split-block.ts:33](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/commands/src/split-block.ts#L33)

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
