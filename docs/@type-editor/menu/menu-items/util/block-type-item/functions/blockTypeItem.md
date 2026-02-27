[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/menu](../../../../README.md) / [menu-items/util/block-type-item](../README.md) / blockTypeItem

# Function: blockTypeItem()

```ts
function blockTypeItem(nodeType, options): MenuItem;
```

Defined in: [packages/menu/src/menu-items/util/block-type-item.ts:19](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/menu/src/menu-items/util/block-type-item.ts#L19)

Build a menu item for changing the type of the textblock around the
selection to the given type. Provides `run`, `active`, and `select`
properties. Others must be given in `options`. `options.attrs` may
be an object to provide the attributes for the textblock node.

## Parameters

| Parameter  | Type                                                                                                                                                              | Description                                      |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `nodeType` | `NodeType`                                                                                                                                                        | The node type to change the textblock to         |
| `options`  | `Partial`&lt;[`MenuItemSpec`](../../../../types/MenuItemSpec/interfaces/MenuItemSpec.md)&gt; & \{ `attrs?`: `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt;; \} | Additional menu item options and node attributes |

## Returns

[`MenuItem`](../../../../menubar/MenuItem/classes/MenuItem.md)

A new MenuItem instance configured for block type changes
