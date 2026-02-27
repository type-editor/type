[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/menu](../../../../README.md) / [menubar/dropdown/DropdownSubmenu](../README.md) / DropdownSubmenu

# Class: DropdownSubmenu

Defined in: [packages/menu/src/menubar/dropdown/DropdownSubmenu.ts:16](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menubar/dropdown/DropdownSubmenu.ts#L16)

Represents a submenu wrapping a group of elements that start
hidden and expand to the right when hovered over or tapped.

## Extends

- [`AbstractDropdownMenu`](../../AbstractDropdownMenu/classes/AbstractDropdownMenu.md)

## Implements

- [`MenuElement`](../../../../types/MenuElement/interfaces/MenuElement.md)

## Constructors

### Constructor

```ts
new DropdownSubmenu(content, options?): DropdownSubmenu;
```

Defined in: [packages/menu/src/menubar/dropdown/DropdownSubmenu.ts:26](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menubar/dropdown/DropdownSubmenu.ts#L26)

Creates a submenu for the given group of menu elements.

#### Parameters

| Parameter | Type                                                                                                                                                               | Description                                                               |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| `content` | \| [`MenuElement`](../../../../types/MenuElement/interfaces/MenuElement.md) \| readonly [`MenuElement`](../../../../types/MenuElement/interfaces/MenuElement.md)[] | A single menu element or array of menu elements to display in the submenu |
| `options` | [`SubMenuOptions`](../../../../types/SubMenuOptions/interfaces/SubMenuOptions.md)                                                                                  | Configuration options for the submenu appearance                          |

#### Returns

`DropdownSubmenu`

#### Overrides

[`AbstractDropdownMenu`](../../AbstractDropdownMenu/classes/AbstractDropdownMenu.md).[`constructor`](../../AbstractDropdownMenu/classes/AbstractDropdownMenu.md#constructor)

## Properties

| Property                            | Modifier   | Type                                                                                | Inherited from                                                                                                                                                            | Defined in                                                                                                                                                                                                        |
| ----------------------------------- | ---------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-items"></a> `items` | `readonly` | readonly [`MenuElement`](../../../../types/MenuElement/interfaces/MenuElement.md)[] | [`AbstractDropdownMenu`](../../AbstractDropdownMenu/classes/AbstractDropdownMenu.md).[`items`](../../AbstractDropdownMenu/classes/AbstractDropdownMenu.md#property-items) | [packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts:31](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts#L31) |

## Accessors

### content

#### Get Signature

```ts
get content(): readonly MenuElement[];
```

Defined in: [packages/menu/src/menubar/dropdown/DropdownSubmenu.ts:32](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menubar/dropdown/DropdownSubmenu.ts#L32)

##### Returns

readonly [`MenuElement`](../../../../types/MenuElement/interfaces/MenuElement.md)[]

---

### options

#### Get Signature

```ts
get options(): SubMenuOptions;
```

Defined in: [packages/menu/src/menubar/dropdown/DropdownSubmenu.ts:36](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menubar/dropdown/DropdownSubmenu.ts#L36)

##### Returns

[`SubMenuOptions`](../../../../types/SubMenuOptions/interfaces/SubMenuOptions.md)

## Methods

### isMenuEvent()

```ts
protected isMenuEvent(wrapper): boolean;
```

Defined in: [packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts:93](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts#L93)

Checks if a recent event originated from within a menu wrapper.
Events are considered "recent" if they occurred within the last 100ms.

#### Parameters

| Parameter | Type          | Description                               |
| --------- | ------------- | ----------------------------------------- |
| `wrapper` | `HTMLElement` | The menu wrapper element to check against |

#### Returns

`boolean`

true if a recent event originated from within the wrapper

#### Inherited from

[`AbstractDropdownMenu`](../../AbstractDropdownMenu/classes/AbstractDropdownMenu.md).[`isMenuEvent`](../../AbstractDropdownMenu/classes/AbstractDropdownMenu.md#ismenuevent)

---

### markMenuEvent()

```ts
protected markMenuEvent(e): void;
```

Defined in: [packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts:105](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts#L105)

Marks an event as a menu event by recording its timestamp and target node.

#### Parameters

| Parameter | Type    | Description       |
| --------- | ------- | ----------------- |
| `e`       | `Event` | The event to mark |

#### Returns

`void`

#### Inherited from

[`AbstractDropdownMenu`](../../AbstractDropdownMenu/classes/AbstractDropdownMenu.md).[`markMenuEvent`](../../AbstractDropdownMenu/classes/AbstractDropdownMenu.md#markmenuevent)

---

### render()

```ts
render(view): {
  dom: HTMLElement;
  update: (state) => boolean;
};
```

Defined in: [packages/menu/src/menubar/dropdown/DropdownSubmenu.ts:46](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menubar/dropdown/DropdownSubmenu.ts#L46)

Renders the submenu.

#### Parameters

| Parameter | Type           | Description              |
| --------- | -------------- | ------------------------ |
| `view`    | `PmEditorView` | The editor view instance |

#### Returns

```ts
{
  dom: HTMLElement;
  update: (state) => boolean;
}
```

An object containing the DOM element and an update function

| Name       | Type                   | Default value | Defined in                                                                                                                                                                                                |
| ---------- | ---------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dom`      | `HTMLElement`          | `wrap`        | [packages/menu/src/menubar/dropdown/DropdownSubmenu.ts:109](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menubar/dropdown/DropdownSubmenu.ts#L109) |
| `update()` | (`state`) => `boolean` | -             | [packages/menu/src/menubar/dropdown/DropdownSubmenu.ts:110](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menubar/dropdown/DropdownSubmenu.ts#L110) |

#### Implementation of

[`MenuElement`](../../../../types/MenuElement/interfaces/MenuElement.md).[`render`](../../../../types/MenuElement/interfaces/MenuElement.md#render)

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

Defined in: [packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts:45](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts#L45)

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
| `dom`      | `HTMLElement` \| `HTMLElement`[] | -              | [packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts:80](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts#L80) |
| `domList`  | `HTMLElement`[]                  | `subMenuItems` | [packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts:82](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts#L82) |
| `update()` | (`state`) => `boolean`           | -              | [packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts:81](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts#L81) |

#### Inherited from

[`AbstractDropdownMenu`](../../AbstractDropdownMenu/classes/AbstractDropdownMenu.md).[`renderDropdownItems`](../../AbstractDropdownMenu/classes/AbstractDropdownMenu.md#renderdropdownitems)
