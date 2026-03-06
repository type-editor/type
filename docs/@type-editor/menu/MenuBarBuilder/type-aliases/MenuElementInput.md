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

Defined in: [packages/menu/src/MenuBarBuilder.ts:16](https://github.com/type-editor/type/blob/aa914636446ba41d4acaa23bd67323cc71b1ac08/packages/menu/src/MenuBarBuilder.ts#L16)

Accepted input types for a single menu element entry in a group or dropdown.
Arrays of `MenuElement` are flattened, while falsy values (`null`, `undefined`) are ignored.
