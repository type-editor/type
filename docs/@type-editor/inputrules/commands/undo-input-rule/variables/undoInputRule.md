[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/inputrules](../../../README.md) / [commands/undo-input-rule](../README.md) / undoInputRule

# Variable: undoInputRule

```ts
const undoInputRule: Command;
```

Defined in: [commands/undo-input-rule.ts:15](https://github.com/type-editor/type/blob/aa914636446ba41d4acaa23bd67323cc71b1ac08/packages/inputrules/src/commands/undo-input-rule.ts#L15)

This is a command that will undo an input rule, if applying such a
rule was the last thing that the user did.

## Param

The current editor state

## Param

Function to dispatch the undo transaction

## Returns

`true` if an input rule was undone, `false` otherwise
