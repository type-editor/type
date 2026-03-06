[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [backspace](../README.md) / backspace

# Variable: backspace

```ts
const backspace: Command;
```

Defined in: [backspace.ts:20](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/commands/src/backspace.ts#L20)

Default command for the backspace key.

This command chains together four operations:

1. Delete the selection if one exists
2. If the cursor is at the start of the first paragraph of a list item, merge
   that paragraph with the last paragraph of the previous list item (inserting a
   space at the boundary) instead of simply joining the two list items as containers
3. Try to join with the block before the cursor
4. Try to select the node before the cursor
