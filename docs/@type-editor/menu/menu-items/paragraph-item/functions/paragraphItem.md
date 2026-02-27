[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/menu](../../../README.md) / [menu-items/paragraph-item](../README.md) / paragraphItem

# Function: paragraphItem()

```ts
function paragraphItem(title?, nodeType?, ulNodeType?, olNodeType?): MenuItem;
```

Defined in: [packages/menu/src/menu-items/paragraph-item.ts:15](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/menu-items/paragraph-item.ts#L15)

Menu item for the `paragraph` command.

## Parameters

| Parameter    | Type       | Default value               |
| ------------ | ---------- | --------------------------- |
| `title`      | `string`   | `'Paragraph'`               |
| `nodeType`   | `NodeType` | `schema.nodes.paragraph`    |
| `ulNodeType` | `NodeType` | `schema.nodes.bullet_list`  |
| `olNodeType` | `NodeType` | `schema.nodes.ordered_list` |

## Returns

[`MenuItem`](../../../menubar/MenuItem/classes/MenuItem.md)
