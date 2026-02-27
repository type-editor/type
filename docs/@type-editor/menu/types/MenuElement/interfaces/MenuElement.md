[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/menu](../../../README.md) / [types/MenuElement](../README.md) / MenuElement

# Interface: MenuElement

Defined in: [packages/menu/src/types/MenuElement.ts:10](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/types/MenuElement.ts#L10)

The types defined in this module aren't the only thing you can
display in your menu. Anything that conforms to this interface can
be put into a menu structure.

## Methods

### render()

```ts
render(
   view,
   showLabel?,
   isLegacy?,
   parentMenuElement?): {
  dom: HTMLElement;
  update: (state) => boolean;
};
```

Defined in: [packages/menu/src/types/MenuElement.ts:24](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/types/MenuElement.ts#L24)

Render the element for display in the menu. Must return a DOM
element and a function that can be used to update the element to
a new state. The `update` function must return false if the
update hid the entire element.

#### Parameters

| Parameter            | Type                                                                           | Description                                                                                   |
| -------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `view`               | `PmEditorView`                                                                 | The editor view instance                                                                      |
| `showLabel?`         | `boolean`                                                                      | Whether to show the label (if applicable, e.g. in DropdownMenu)                               |
| `isLegacy?`          | `boolean`                                                                      | Backward compatibility mode                                                                   |
| `parentMenuElement?` | [`ParentMenuElement`](../../ParentMenuElement/interfaces/ParentMenuElement.md) | The parent menu element to notify of updates of child elements (especially in dropdown menus) |

#### Returns

```ts
{
  dom: HTMLElement;
  update: (state) => boolean;
}
```

An object containing the DOM element and an update function

| Name       | Type                   | Defined in                                                                                                                                                                |
| ---------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dom`      | `HTMLElement`          | [packages/menu/src/types/MenuElement.ts:24](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/types/MenuElement.ts#L24) |
| `update()` | (`state`) => `boolean` | [packages/menu/src/types/MenuElement.ts:24](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/types/MenuElement.ts#L24) |
