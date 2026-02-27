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

Defined in: [packages/menu/src/MenuBarBuilder.ts:17](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/menu/src/MenuBarBuilder.ts#L17)

Accepted input types for a single menu element entry in a group or dropdown.
Arrays of `MenuElement` are flattened, while falsy values (`null`, `undefined`) are ignored.
