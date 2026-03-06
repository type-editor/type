[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [insert-hard-break](../README.md) / insertHardBreak

# Function: insertHardBreak()

```ts
function insertHardBreak(schema): Command;
```

Defined in: [insert-hard-break.ts:13](https://github.com/type-editor/type/blob/aa914636446ba41d4acaa23bd67323cc71b1ac08/packages/commands/src/insert-hard-break.ts#L13)

Creates a command that inserts a hard break (line break) at the current selection.

The hard break replaces the current selection and scrolls the view to ensure
the inserted break is visible.

## Parameters

| Parameter | Type       | Description                                         |
| --------- | ---------- | --------------------------------------------------- |
| `schema`  | `NodeType` | The node type for the hard break element to insert. |

## Returns

`Command`

A command function that inserts the hard break when executed.
