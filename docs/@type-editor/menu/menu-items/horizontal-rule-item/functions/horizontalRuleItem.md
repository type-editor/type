[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/menu](../../../README.md) / [menu-items/horizontal-rule-item](../README.md) / horizontalRuleItem

# Function: horizontalRuleItem()

```ts
function horizontalRuleItem(title?, nodeType?, codeBlockNodeType?): MenuItem;
```

Defined in: [packages/menu/src/menu-items/horizontal-rule-item.ts:13](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/menu-items/horizontal-rule-item.ts#L13)

Menu item for the `horizontal rule` command.

## Parameters

| Parameter           | Type       | Default value                  |
| ------------------- | ---------- | ------------------------------ |
| `title`             | `string`   | `'Horizontal Rule'`            |
| `nodeType`          | `NodeType` | `schema.nodes.horizontal_rule` |
| `codeBlockNodeType` | `NodeType` | `schema.nodes.code_block`      |

## Returns

[`MenuItem`](../../../menubar/MenuItem/classes/MenuItem.md)
