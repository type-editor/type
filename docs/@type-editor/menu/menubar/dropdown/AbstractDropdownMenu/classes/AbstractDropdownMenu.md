[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/menu](../../../../README.md) / [menubar/dropdown/AbstractDropdownMenu](../README.md) / AbstractDropdownMenu

# Class: AbstractDropdownMenu

Defined in: [packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts:22](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts#L22)

## Extended by

- [`DropdownLegacy`](../../DropdownLegacy/classes/DropdownLegacy.md)
- [`DropdownSubmenu`](../../DropdownSubmenu/classes/DropdownSubmenu.md)

## Constructors

### Constructor

```ts
protected new AbstractDropdownMenu(items): AbstractDropdownMenu;
```

Defined in: [packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts:33](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts#L33)

#### Parameters

| Parameter | Type                                                                                |
| --------- | ----------------------------------------------------------------------------------- |
| `items`   | readonly [`MenuElement`](../../../../types/MenuElement/interfaces/MenuElement.md)[] |

#### Returns

`AbstractDropdownMenu`

## Properties

| Property                            | Modifier   | Type                                                                                | Defined in                                                                                                                                                                                                        |
| ----------------------------------- | ---------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-items"></a> `items` | `readonly` | readonly [`MenuElement`](../../../../types/MenuElement/interfaces/MenuElement.md)[] | [packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts:31](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts#L31) |

## Methods

### isMenuEvent()

```ts
protected isMenuEvent(wrapper): boolean;
```

Defined in: [packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts:93](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts#L93)

Checks if a recent event originated from within a menu wrapper.
Events are considered "recent" if they occurred within the last 100ms.

#### Parameters

| Parameter | Type          | Description                               |
| --------- | ------------- | ----------------------------------------- |
| `wrapper` | `HTMLElement` | The menu wrapper element to check against |

#### Returns

`boolean`

true if a recent event originated from within the wrapper

---

### markMenuEvent()

```ts
protected markMenuEvent(e): void;
```

Defined in: [packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts:105](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts#L105)

Marks an event as a menu event by recording its timestamp and target node.

#### Parameters

| Parameter | Type    | Description       |
| --------- | ------- | ----------------- |
| `e`       | `Event` | The event to mark |

#### Returns

`void`

---

### renderDropdownItems()

```ts
protected renderDropdownItems(
   view,
   options?,
   isLegacy?): {
  dom: HTMLElement | HTMLElement[];
  domList: HTMLElement[];
  update: (state) => boolean;
};
```

Defined in: [packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts:45](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts#L45)

Renders an array of menu elements as dropdown items.

#### Parameters

| Parameter  | Type                                                                                             | Default value | Description                                                    |
| ---------- | ------------------------------------------------------------------------------------------------ | ------------- | -------------------------------------------------------------- |
| `view`     | `PmEditorView`                                                                                   | `undefined`   | The editor view instance                                       |
| `options`  | [`DropdownMenuOptions`](../../../../types/DropdownMenuOptions/interfaces/DropdownMenuOptions.md) | `{}`          | Configuration options for the dropdown appearance and behavior |
| `isLegacy` | `boolean`                                                                                        | `false`       | Backward compatibility mode                                    |

#### Returns

```ts
{
  dom: HTMLElement | HTMLElement[];
  domList: HTMLElement[];
  update: (state) => boolean;
}
```

An object containing rendered DOM elements and a combined update function

| Name       | Type                             | Default value  | Defined in                                                                                                                                                                                                        |
| ---------- | -------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dom`      | `HTMLElement` \| `HTMLElement`[] | -              | [packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts:80](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts#L80) |
| `domList`  | `HTMLElement`[]                  | `subMenuItems` | [packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts:82](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts#L82) |
| `update()` | (`state`) => `boolean`           | -              | [packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts:81](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts#L81) |
