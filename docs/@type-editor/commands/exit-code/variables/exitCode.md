[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [exit-code](../README.md) / exitCode

# Variable: exitCode

```ts
const exitCode: Command;
```

Defined in: [exit-code.ts:36](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/commands/src/exit-code.ts#L36)

Creates a default block after a code block and moves the cursor there.

This command allows users to "exit" from a code block by creating a new default
block (typically a paragraph) immediately after the code block and positioning
the cursor at the start of it. This is particularly useful when the cursor is at
the end of a code block and the user wants to continue editing outside of it.

The command only works when:

- The selection is within a node marked as code (via `NodeSpec.code`)
- The selection is not spanning multiple parents
- A suitable default block type can be inserted after the code block

## Param

The current editor state

## Param

Optional dispatch function to execute the transaction

## Returns

`true` if the command can be applied, `false` otherwise

## Example

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
