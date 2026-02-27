[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/menu](../../../README.md) / [menu-items/code-block-item](../README.md) / codeBlockItem

# Function: codeBlockItem()

```ts
function codeBlockItem(title?, nodeType?, unwrapNodeType?): MenuItem;
```

Defined in: [packages/menu/src/menu-items/code-block-item.ts:15](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/menu/src/menu-items/code-block-item.ts#L15)

Menu item for the `code block` command.

## Parameters

| Parameter        | Type       | Default value             |
| ---------------- | ---------- | ------------------------- |
| `title`          | `string`   | `'Code Block'`            |
| `nodeType`       | `NodeType` | `schema.nodes.code_block` |
| `unwrapNodeType` | `NodeType` | `schema.nodes.paragraph`  |

## Returns

[`MenuItem`](../../../menubar/MenuItem/classes/MenuItem.md)
