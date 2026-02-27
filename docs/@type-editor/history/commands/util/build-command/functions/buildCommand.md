[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/history](../../../../README.md) / [commands/util/build-command](../README.md) / buildCommand

# Function: buildCommand()

```ts
function buildCommand(redo, scroll): Command;
```

Defined in: [commands/util/build-command.ts:26](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/history/src/commands/util/build-command.ts#L26)

Builds a command that performs undo or redo operations.

This factory function creates command functions that can be used in keymaps
or executed programmatically. The returned command follows the ProseMirror
command pattern: it returns true if the command is applicable (even if not
executed due to lack of dispatch), and false if it's not applicable.

## Parameters

| Parameter | Type      | Description                                                              |
| --------- | --------- | ------------------------------------------------------------------------ |
| `redo`    | `boolean` | If true, creates a redo command; if false, creates an undo command       |
| `scroll`  | `boolean` | If true, the command will scroll the selection into view after execution |

## Returns

`Command`

A command function that can be executed against an editor state
