[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/search](../../../../README.md) / [commands/util/replace-command](../README.md) / replaceCommand

# Function: replaceCommand()

```ts
function replaceCommand(wrap, moveForward): Command;
```

Defined in: [commands/util/replace-command.ts:19](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/search/src/commands/util/replace-command.ts#L19)

Factory function that creates a command for replacing search matches.

## Parameters

| Parameter     | Type      | Description                                       |
| ------------- | --------- | ------------------------------------------------- |
| `wrap`        | `boolean` | Whether to wrap around at document boundaries     |
| `moveForward` | `boolean` | Whether to move to the next match after replacing |

## Returns

`Command`

A command that replaces the current or next match
