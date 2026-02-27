[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/history](../../../README.md) / [commands/undo](../README.md) / undo

# Variable: undo

```ts
const undo: Command;
```

Defined in: [commands/undo.ts:21](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/history/src/commands/undo.ts#L21)

A command function that undoes the last change, if any.

This command will undo the most recent change in the editor's history and
automatically scroll the selection into view after the undo operation.

## Returns

A command that can be executed against an editor state

## Example

```typescript
// In a keymap
keymap({
  "Mod-z": undo,
});
```
