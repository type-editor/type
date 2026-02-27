[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/menu](../../../README.md) / [menubar/MenuItem](../README.md) / MenuItem

# Class: MenuItem

Defined in: [packages/menu/src/menubar/MenuItem.ts:15](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/menu/src/menubar/MenuItem.ts#L15)

An icon or label that, when clicked, executes a command.

## Implements

- [`MenuElement`](../../../types/MenuElement/interfaces/MenuElement.md)

## Constructors

### Constructor

```ts
new MenuItem(spec): MenuItem;
```

Defined in: [packages/menu/src/menubar/MenuItem.ts:23](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/menu/src/menubar/MenuItem.ts#L23)

Create a menu item.

#### Parameters

| Parameter | Type                                                                     | Description                        |
| --------- | ------------------------------------------------------------------------ | ---------------------------------- |
| `spec`    | [`MenuItemSpec`](../../../types/MenuItemSpec/interfaces/MenuItemSpec.md) | The spec used to create this item. |

#### Returns

`MenuItem`

## Accessors

### spec

#### Get Signature

```ts
get spec(): MenuItemSpec;
```

Defined in: [packages/menu/src/menubar/MenuItem.ts:27](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/menu/src/menubar/MenuItem.ts#L27)

##### Returns

[`MenuItemSpec`](../../../types/MenuItemSpec/interfaces/MenuItemSpec.md)

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

Defined in: [packages/menu/src/menubar/MenuItem.ts:42](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/menu/src/menubar/MenuItem.ts#L42)

Renders the menu element according to its [display
spec](#menu.MenuItemSpec.display), and adds an event handler which
executes the command when the representation is clicked.

#### Parameters

| Parameter            | Type                                                                                    | Default value | Description                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------- | ------------- | --------------------------------------------------------------------------------------------- |
| `view`               | `PmEditorView`                                                                          | `undefined`   | The editor view instance                                                                      |
| `showLabel`          | `boolean`                                                                               | `false`       | Whether to show the label (if applicable)                                                     |
| `isLegacy`           | `boolean`                                                                               | `false`       | Backward compatibility mode                                                                   |
| `parentMenuElement?` | [`ParentMenuElement`](../../../types/ParentMenuElement/interfaces/ParentMenuElement.md) | `undefined`   | The parent menu element to notify of updates of child elements (especially in dropdown menus) |

#### Returns

```ts
{
  dom: HTMLElement;
  update: (state) => boolean;
}
```

An object containing the DOM element and an update function

| Name       | Type                   | Defined in                                                                                                                                                              |
| ---------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dom`      | `HTMLElement`          | [packages/menu/src/menubar/MenuItem.ts:54](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/menu/src/menubar/MenuItem.ts#L54) |
| `update()` | (`state`) => `boolean` | [packages/menu/src/menubar/MenuItem.ts:54](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/menu/src/menubar/MenuItem.ts#L54) |

#### Implementation of

[`MenuElement`](../../../types/MenuElement/interfaces/MenuElement.md).[`render`](../../../types/MenuElement/interfaces/MenuElement.md#render)
