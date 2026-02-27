[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/menu](../../../README.md) / [menu-items/paragraph-item](../README.md) / paragraphItem

# Function: paragraphItem()

```ts
function paragraphItem(title?, nodeType?, ulNodeType?, olNodeType?): MenuItem;
```

Defined in: [packages/menu/src/menu-items/paragraph-item.ts:15](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/menu/src/menu-items/paragraph-item.ts#L15)

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
