[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/schema](../../README.md) / [util](../README.md) / addListNodes

# Function: addListNodes()

```ts
function addListNodes(nodes, itemContent, listGroup?): OrderedMap<NodeSpec>;
```

Defined in: [util.ts:33](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/schema/src/util.ts#L33)

Convenience function for adding list-related node types to a map
specifying the nodes for a schema. Adds
[`orderedList`](#schema-list.orderedList) as `'ordered_list'`,
[`bulletList`](#schema-list.bulletList) as `'bullet_list'`, and
[`listItem`](#schema-list.listItem) as `'list_item'`.

`itemContent` determines the content expression for the list items.
If you want the commands defined in this module to apply to your
list structure, it should have a shape like `'paragraph block*'` or
`'paragraph (ordered_list | bullet_list)*'`. `listGroup` can be
given to assign a group name to the list node types, for example
`'block'`.

## Parameters

| Parameter     | Type                           |
| ------------- | ------------------------------ |
| `nodes`       | `OrderedMap`&lt;`NodeSpec`&gt; |
| `itemContent` | `string`                       |
| `listGroup?`  | `string`                       |

## Returns

`OrderedMap`&lt;`NodeSpec`&gt;
