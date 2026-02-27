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

Defined in: [packages/menu/src/menu-items/align-item.ts:15](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/menu/src/menu-items/align-item.ts#L15)

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
