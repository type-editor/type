[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [select-all](../README.md) / selectAll

# Variable: selectAll

```ts
const selectAll: Command;
```

Defined in: [select-all.ts:28](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/commands/src/select-all.ts#L28)

Selects the entire document.

This command creates an AllSelection that encompasses the entire document content.
It's typically bound to Ctrl-A/Cmd-A to provide standard "Select All" functionality.

Unlike some commands, this one always returns `true` because it can always be
executed (there's always a document to select).

## Param

The current editor state

## Param

Optional dispatch function to execute the transaction

## Returns

Always returns `true`

## Example

```typescript
// Bind to the standard Select All shortcut
const keymap = {
  "Mod-a": selectAll,
};

// Use programmatically
selectAll(view.state, view.dispatch);
```
