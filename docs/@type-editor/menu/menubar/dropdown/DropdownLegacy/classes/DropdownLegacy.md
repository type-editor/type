[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/menu](../../../../README.md) / [menubar/dropdown/DropdownLegacy](../README.md) / DropdownLegacy

# ~~Class: DropdownLegacy~~

Defined in: [packages/menu/src/menubar/dropdown/DropdownLegacy.ts:17](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/menubar/dropdown/DropdownLegacy.ts#L17)

A drop-down menu, displayed as a label with a downwards-pointing
triangle to the right of it.

## Deprecated

## Extends

- [`AbstractDropdownMenu`](../../AbstractDropdownMenu/classes/AbstractDropdownMenu.md)

## Implements

- [`MenuElement`](../../../../types/MenuElement/interfaces/MenuElement.md)

## Constructors

### Constructor

```ts
new DropdownLegacy(content, options?): DropdownLegacy;
```

Defined in: [packages/menu/src/menubar/dropdown/DropdownLegacy.ts:27](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/menubar/dropdown/DropdownLegacy.ts#L27)

Create a dropdown wrapping the elements.

#### Parameters

| Parameter | Type                                                                                                                                                               | Description                                                                |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| `content` | \| [`MenuElement`](../../../../types/MenuElement/interfaces/MenuElement.md) \| readonly [`MenuElement`](../../../../types/MenuElement/interfaces/MenuElement.md)[] | A single menu element or array of menu elements to display in the dropdown |
| `options` | [`DropdownMenuOptions`](../../../../types/DropdownMenuOptions/interfaces/DropdownMenuOptions.md)                                                                   | Configuration options for the dropdown appearance and behavior             |

#### Returns

`DropdownLegacy`

#### Overrides

[`AbstractDropdownMenu`](../../AbstractDropdownMenu/classes/AbstractDropdownMenu.md).[`constructor`](../../AbstractDropdownMenu/classes/AbstractDropdownMenu.md#constructor)

## Properties

| Property                                | Modifier   | Type                                                                                | Inherited from                                                                                                                                                            | Defined in                                                                                                                                                                                                        |
| --------------------------------------- | ---------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-items"></a> ~~`items`~~ | `readonly` | readonly [`MenuElement`](../../../../types/MenuElement/interfaces/MenuElement.md)[] | [`AbstractDropdownMenu`](../../AbstractDropdownMenu/classes/AbstractDropdownMenu.md).[`items`](../../AbstractDropdownMenu/classes/AbstractDropdownMenu.md#property-items) | [packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts:31](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/menubar/dropdown/AbstractDropdownMenu.ts#L31) |

## Accessors

### ~~content~~

#### Get Signature

```ts
get content(): readonly MenuElement[];
```

Defined in: [packages/menu/src/menubar/dropdown/DropdownLegacy.ts:33](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/menubar/dropdown/DropdownLegacy.ts#L33)

##### Returns

readonly [`MenuElement`](../../../../types/MenuElement/interfaces/MenuElement.md)[]

---

### ~~options~~

#### Get Signature

```ts
get options(): DropdownMenuOptions;
```

Defined in: [packages/menu/src/menubar/dropdown/DropdownLegacy.ts:37](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/menubar/dropdown/DropdownLegacy.ts#L37)

##### Returns

[`DropdownMenuOptions`](../../../../types/DropdownMenuOptions/interfaces/DropdownMenuOptions.md)

## Methods

### ~~isMenuEvent()~~

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

#### Inherited from

[`AbstractDropdownMenu`](../../AbstractDropdownMenu/classes/AbstractDropdownMenu.md).[`isMenuEvent`](../../AbstractDropdownMenu/classes/AbstractDropdownMenu.md#ismenuevent)

---

### ~~markMenuEvent()~~

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

#### Inherited from

[`AbstractDropdownMenu`](../../AbstractDropdownMenu/classes/AbstractDropdownMenu.md).[`markMenuEvent`](../../AbstractDropdownMenu/classes/AbstractDropdownMenu.md#markmenuevent)

---

### ~~render()~~

```ts
render(view): {
  dom: HTMLElement;
  update: (state) => boolean;
};
```

Defined in: [packages/menu/src/menubar/dropdown/DropdownLegacy.ts:47](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/menubar/dropdown/DropdownLegacy.ts#L47)

Render the dropdown menu and sub-items.

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

| Name       | Type                   | Default value | Defined in                                                                                                                                                                                              |
| ---------- | ---------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dom`      | `HTMLElement`          | `wrap`        | [packages/menu/src/menubar/dropdown/DropdownLegacy.ts:111](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/menubar/dropdown/DropdownLegacy.ts#L111) |
| `update()` | (`state`) => `boolean` | -             | [packages/menu/src/menubar/dropdown/DropdownLegacy.ts:112](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/menubar/dropdown/DropdownLegacy.ts#L112) |

#### Implementation of

[`MenuElement`](../../../../types/MenuElement/interfaces/MenuElement.md).[`render`](../../../../types/MenuElement/interfaces/MenuElement.md#render)

---

### ~~renderDropdownItems()~~

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

#### Inherited from

[`AbstractDropdownMenu`](../../AbstractDropdownMenu/classes/AbstractDropdownMenu.md).[`renderDropdownItems`](../../AbstractDropdownMenu/classes/AbstractDropdownMenu.md#renderdropdownitems)
