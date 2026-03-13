[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/menu](../../README.md) / [MenuBarBuilder](../README.md) / MenuElementInput

# Type Alias: MenuElementInput

```ts
type MenuElementInput =
  | (MenuElement | null)[]
  | MenuItem
  | Dropdown
  | DropdownLegacy
  | undefined;
```

Defined in: [packages/menu/src/MenuBarBuilder.ts:16](https://github.com/type-editor/type/blob/4813813a587dda7eec62dd72332119887ded8d65/packages/menu/src/MenuBarBuilder.ts#L16)

Accepted input types for a single menu element entry in a group or dropdown.
Arrays of `MenuElement` are flattened, while falsy values (`null`, `undefined`) are ignored.
