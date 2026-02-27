[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/history](../../../README.md) / [commands/redo](../README.md) / redo

# Variable: redo

```ts
const redo: Command;
```

Defined in: [commands/redo.ts:22](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/history/src/commands/redo.ts#L22)

A command function that redoes the last undone change, if any.

This command will redo the most recently undone change in the editor's history
and automatically scroll the selection into view after the redo operation.

## Returns

A command that can be executed against an editor state

## Example

```typescript
// In a keymap
keymap({
  "Mod-Shift-z": redo,
});
```
