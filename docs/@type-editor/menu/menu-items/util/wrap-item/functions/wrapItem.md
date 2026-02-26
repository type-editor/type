[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/menu](../../../../README.md) / [menu-items/util/wrap-item](../README.md) / wrapItem

# Function: wrapItem()

```ts
function wrapItem(nodeType, options): MenuItem;
```

Defined in: [packages/menu/src/menu-items/util/wrap-item.ts:19](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/menu/src/menu-items/util/wrap-item.ts#L19)

Build a menu item for wrapping the selection in a given node type.
Adds `run` and `select` properties to the ones present in
`options`. `options.attrs` may be an object that provides
attributes for the wrapping node.

## Parameters

| Parameter  | Type                                                                                                                                                              | Description                                      |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `nodeType` | `NodeType`                                                                                                                                                        | The node type to wrap the selection in           |
| `options`  | `Partial`&lt;[`MenuItemSpec`](../../../../types/MenuItemSpec/interfaces/MenuItemSpec.md)&gt; & \{ `attrs?`: `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt;; \} | Additional menu item options and node attributes |

## Returns

[`MenuItem`](../../../../menubar/MenuItem/classes/MenuItem.md)

A new MenuItem instance configured for wrapping
