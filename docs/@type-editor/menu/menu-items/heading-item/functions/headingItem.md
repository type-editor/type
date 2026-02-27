[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/menu](../../../README.md) / [menu-items/heading-item](../README.md) / headingItem

# Function: headingItem()

```ts
function headingItem(level?, title?, nodeType?, codeBlockNodeType?): MenuItem;
```

Defined in: [packages/menu/src/menu-items/heading-item.ts:16](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/menu/src/menu-items/heading-item.ts#L16)

Menu item for the `heading` command.

## Parameters

| Parameter           | Type                                               | Default value             |
| ------------------- | -------------------------------------------------- | ------------------------- |
| `level`             | `"1"` \| `"2"` \| `"3"` \| `"4"` \| `"5"` \| `"6"` | `'1'`                     |
| `title`             | `string`                                           | `...`                     |
| `nodeType`          | `NodeType`                                         | `schema.nodes.heading`    |
| `codeBlockNodeType` | `NodeType`                                         | `schema.nodes.code_block` |

## Returns

[`MenuItem`](../../../menubar/MenuItem/classes/MenuItem.md)
