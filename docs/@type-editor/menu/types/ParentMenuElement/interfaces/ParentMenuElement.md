[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/menu](../../../README.md) / [types/ParentMenuElement](../README.md) / ParentMenuElement

# Interface: ParentMenuElement

Defined in: [packages/menu/src/types/ParentMenuElement.ts:8](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/menu/src/types/ParentMenuElement.ts#L8)

This is mainly intended to use in dropdown menus, where the
parent menu element needs to be notified when a sub-element
becomes active especially to show the active label.

## Methods

### notifySubElementIsActive()

```ts
notifySubElementIsActive(menuItemSpec): void;
```

Defined in: [packages/menu/src/types/ParentMenuElement.ts:10](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/menu/src/types/ParentMenuElement.ts#L10)

#### Parameters

| Parameter      | Type                                                            |
| -------------- | --------------------------------------------------------------- |
| `menuItemSpec` | [`MenuItemSpec`](../../MenuItemSpec/interfaces/MenuItemSpec.md) |

#### Returns

`void`
