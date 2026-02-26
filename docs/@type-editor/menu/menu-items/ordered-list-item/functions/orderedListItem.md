[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/menu](../../../README.md) / [menu-items/ordered-list-item](../README.md) / orderedListItem

# Function: orderedListItem()

```ts
function orderedListItem(title?, olNodeType?, ulNodeType?): MenuItem;
```

Defined in: [packages/menu/src/menu-items/ordered-list-item.ts:15](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/menu/src/menu-items/ordered-list-item.ts#L15)

Menu item for the `orderedList` command.

## Parameters

| Parameter    | Type       | Default value               |
| ------------ | ---------- | --------------------------- |
| `title`      | `string`   | `'Numbered List'`           |
| `olNodeType` | `NodeType` | `schema.nodes.ordered_list` |
| `ulNodeType` | `NodeType` | `schema.nodes.bullet_list`  |

## Returns

[`MenuItem`](../../../menubar/MenuItem/classes/MenuItem.md)
