[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/menu](../../../../README.md) / [menubar/dropdown/Dropdown](../README.md) / Dropdown

# Class: Dropdown

Defined in: [packages/menu/src/menubar/dropdown/Dropdown.ts:18](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menubar/dropdown/Dropdown.ts#L18)

A drop-down menu, displayed as a label with a downwards-pointing
triangle to the right of it.

## Implements

- [`MenuElement`](../../../../types/MenuElement/interfaces/MenuElement.md)
- [`ParentMenuElement`](../../../../types/ParentMenuElement/interfaces/ParentMenuElement.md)

## Constructors

### Constructor

```ts
new Dropdown(content, options?): Dropdown;
```

Defined in: [packages/menu/src/menubar/dropdown/Dropdown.ts:45](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menubar/dropdown/Dropdown.ts#L45)

Create a dropdown wrapping the elements.

#### Parameters

| Parameter | Type                                                                                                                                                               | Description                                                                |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| `content` | \| [`MenuElement`](../../../../types/MenuElement/interfaces/MenuElement.md) \| readonly [`MenuElement`](../../../../types/MenuElement/interfaces/MenuElement.md)[] | A single menu element or array of menu elements to display in the dropdown |
| `options` | [`DropdownMenuOptions`](../../../../types/DropdownMenuOptions/interfaces/DropdownMenuOptions.md)                                                                   | Configuration options for the dropdown appearance and behavior             |

#### Returns

`Dropdown`

## Properties

| Property                            | Modifier   | Type                                                                                | Defined in                                                                                                                                                                                |
| ----------------------------------- | ---------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-items"></a> `items` | `readonly` | readonly [`MenuElement`](../../../../types/MenuElement/interfaces/MenuElement.md)[] | [packages/menu/src/menubar/dropdown/Dropdown.ts:20](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menubar/dropdown/Dropdown.ts#L20) |

## Accessors

### content

#### Get Signature

```ts
get content(): readonly MenuElement[];
```

Defined in: [packages/menu/src/menubar/dropdown/Dropdown.ts:51](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menubar/dropdown/Dropdown.ts#L51)

##### Returns

readonly [`MenuElement`](../../../../types/MenuElement/interfaces/MenuElement.md)[]

---

### options

#### Get Signature

```ts
get options(): DropdownMenuOptions;
```

Defined in: [packages/menu/src/menubar/dropdown/Dropdown.ts:55](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menubar/dropdown/Dropdown.ts#L55)

##### Returns

[`DropdownMenuOptions`](../../../../types/DropdownMenuOptions/interfaces/DropdownMenuOptions.md)

## Methods

### destroy()

```ts
destroy(): void;
```

Defined in: [packages/menu/src/menubar/dropdown/Dropdown.ts:152](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menubar/dropdown/Dropdown.ts#L152)

Clean up event listeners and references to prevent memory leaks.
Should be called when the dropdown is no longer needed.

#### Returns

`void`

---

### notifySubElementIsActive()

```ts
notifySubElementIsActive(menuItemSpec): void;
```

Defined in: [packages/menu/src/menubar/dropdown/Dropdown.ts:134](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menubar/dropdown/Dropdown.ts#L134)

#### Parameters

| Parameter      | Type                                                                        |
| -------------- | --------------------------------------------------------------------------- |
| `menuItemSpec` | [`MenuItemSpec`](../../../../types/MenuItemSpec/interfaces/MenuItemSpec.md) |

#### Returns

`void`

#### Implementation of

[`ParentMenuElement`](../../../../types/ParentMenuElement/interfaces/ParentMenuElement.md).[`notifySubElementIsActive`](../../../../types/ParentMenuElement/interfaces/ParentMenuElement.md#notifysubelementisactive)

---

### render()

```ts
render(editorView): {
  dom: HTMLElement;
  update: (state) => boolean;
};
```

Defined in: [packages/menu/src/menubar/dropdown/Dropdown.ts:65](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menubar/dropdown/Dropdown.ts#L65)

Render the dropdown menu and sub-items.

#### Parameters

| Parameter    | Type           | Description              |
| ------------ | -------------- | ------------------------ |
| `editorView` | `PmEditorView` | The editor view instance |

#### Returns

```ts
{
  dom: HTMLElement;
  update: (state) => boolean;
}
```

An object containing the DOM element and an update function

| Name       | Type                   | Defined in                                                                                                                                                                                  |
| ---------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dom`      | `HTMLElement`          | [packages/menu/src/menubar/dropdown/Dropdown.ts:129](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menubar/dropdown/Dropdown.ts#L129) |
| `update()` | (`state`) => `boolean` | [packages/menu/src/menubar/dropdown/Dropdown.ts:130](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menubar/dropdown/Dropdown.ts#L130) |

#### Implementation of

[`MenuElement`](../../../../types/MenuElement/interfaces/MenuElement.md).[`render`](../../../../types/MenuElement/interfaces/MenuElement.md#render)
