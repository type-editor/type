[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/menu](../../../../README.md) / [menu-items/util/is-in-list](../README.md) / isInList

# Function: isInList()

```ts
function isInList(state, listNodeType1, listNodeType2): boolean;
```

Defined in: [packages/menu/src/menu-items/util/is-in-list.ts:15](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/menu/src/menu-items/util/is-in-list.ts#L15)

Checks if the current selection is inside a list node.

## Parameters

| Parameter       | Type            | Description                                                 |
| --------------- | --------------- | ----------------------------------------------------------- |
| `state`         | `PmEditorState` | The current editor state                                    |
| `listNodeType1` | `NodeType`      | The first list node type to check for (e.g., bullet_list)   |
| `listNodeType2` | `NodeType`      | The second list node type to check for (e.g., ordered_list) |

## Returns

`boolean`

`true` if the selection is within a list of either type, `false` otherwise
