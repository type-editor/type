[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/menu](../../../../README.md) / [menu-items/util/is-in-list](../README.md) / isInList

# Function: isInList()

```ts
function isInList(state, listNodeType1, listNodeType2): boolean;
```

Defined in: [packages/menu/src/menu-items/util/is-in-list.ts:15](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/menu/src/menu-items/util/is-in-list.ts#L15)

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
