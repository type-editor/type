[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/menu](../../../README.md) / [menu-items/bullet-list-item](../README.md) / bulletListItem

# Function: bulletListItem()

```ts
function bulletListItem(title?, ulNodeType?, olNodeType?): MenuItem;
```

Defined in: [packages/menu/src/menu-items/bullet-list-item.ts:15](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/menu/src/menu-items/bullet-list-item.ts#L15)

Menu item for the `bulletList` command.

## Parameters

| Parameter    | Type       | Default value               |
| ------------ | ---------- | --------------------------- |
| `title`      | `string`   | `'Bullet List'`             |
| `ulNodeType` | `NodeType` | `schema.nodes.bullet_list`  |
| `olNodeType` | `NodeType` | `schema.nodes.ordered_list` |

## Returns

[`MenuItem`](../../../menubar/MenuItem/classes/MenuItem.md)
