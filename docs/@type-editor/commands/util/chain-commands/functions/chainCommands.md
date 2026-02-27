[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/commands](../../../README.md) / [util/chain-commands](../README.md) / chainCommands

# Function: chainCommands()

```ts
function chainCommands(...commands): Command;
```

Defined in: [util/chain-commands.ts:32](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/commands/src/util/chain-commands.ts#L32)

Combines multiple command functions into a single command that executes them sequentially
until one succeeds.

This function creates a command that tries each provided command in order. The first command
that returns `true` (indicating success) will stop the chain, and the chained command will
return `true`. If all commands return `false`, the chained command returns `false`.

This is particularly useful for creating fallback behavior where you want to try multiple
strategies for handling a user action.

## Parameters

| Parameter     | Type                 | Description                                            |
| ------------- | -------------------- | ------------------------------------------------------ |
| ...`commands` | readonly `Command`[] | Variable number of command functions to chain together |

## Returns

`Command`

A new command that executes the provided commands in sequence

## Example

```typescript
// Create a command that tries to delete selection, then join backward, then select backward
const myBackspaceCommand = chainCommands(
  deleteSelection,
  joinBackward,
  selectNodeBackward,
);

// Use in a keymap
const keymap = {
  Backspace: chainCommands(deleteSelection, joinBackward),
};
```
