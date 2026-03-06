[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/menu](../../../README.md) / [menu-items/align-item](../README.md) / alignItem

# Function: alignItem()

```ts
function alignItem(
  align?,
  title?,
  codeBlockNodeType?,
  paragraphType?,
  figureType?,
  ulNodeType?,
  olNodeType?,
): MenuItem;
```

Defined in: [packages/menu/src/menu-items/align-item.ts:15](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/menu/src/menu-items/align-item.ts#L15)

Menu item for the `align` command.

## Parameters

| Parameter           | Type                                               | Default value               |
| ------------------- | -------------------------------------------------- | --------------------------- |
| `align`             | `"center"` \| `"left"` \| `"right"` \| `"justify"` | `'left'`                    |
| `title`             | `"center"` \| `"left"` \| `"right"` \| `"justify"` | `align`                     |
| `codeBlockNodeType` | `NodeType`                                         | `schema.nodes.code_block`   |
| `paragraphType`     | `NodeType`                                         | `schema.nodes.paragraph`    |
| `figureType`        | `NodeType`                                         | `schema.nodes.figure`       |
| `ulNodeType`        | `NodeType`                                         | `schema.nodes.bullet_list`  |
| `olNodeType`        | `NodeType`                                         | `schema.nodes.ordered_list` |

## Returns

[`MenuItem`](../../../menubar/MenuItem/classes/MenuItem.md)
