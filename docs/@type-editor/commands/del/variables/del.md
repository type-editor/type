[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [del](../README.md) / del

# Variable: del

```ts
const del: Command;
```

Defined in: [del.ts:18](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/commands/src/del.ts#L18)

Default command for the delete/forward-delete key.

This command chains together three operations:

1. Delete the selection if one exists
2. Try to join with the block after the cursor
3. Try to select the node after the cursor

This provides comprehensive forward-delete behavior for most editing scenarios.
