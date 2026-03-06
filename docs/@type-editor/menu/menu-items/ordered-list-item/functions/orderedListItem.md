[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/menu](../../../README.md) / [menu-items/ordered-list-item](../README.md) / orderedListItem

# Function: orderedListItem()

```ts
function orderedListItem(title?, olNodeType?, ulNodeType?): MenuItem;
```

Defined in: [packages/menu/src/menu-items/ordered-list-item.ts:15](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/menu/src/menu-items/ordered-list-item.ts#L15)

Menu item for the `orderedList` command.

## Parameters

| Parameter    | Type       | Default value               |
| ------------ | ---------- | --------------------------- |
| `title`      | `string`   | `'Numbered List'`           |
| `olNodeType` | `NodeType` | `schema.nodes.ordered_list` |
| `ulNodeType` | `NodeType` | `schema.nodes.bullet_list`  |

## Returns

[`MenuItem`](../../../menubar/MenuItem/classes/MenuItem.md)
