[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/menu](../../../README.md) / [menubar/WcagKeyNavUtil](../README.md) / WcagKeyNavUtil

# Class: WcagKeyNavUtil

Defined in: [packages/menu/src/menubar/WcagKeyNavUtil.ts:2](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/menu/src/menubar/WcagKeyNavUtil.ts#L2)

## Constructors

### Constructor

```ts
new WcagKeyNavUtil(
   menu,
   menuItems,
   isHorizontal?): WcagKeyNavUtil;
```

Defined in: [packages/menu/src/menubar/WcagKeyNavUtil.ts:25](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/menu/src/menubar/WcagKeyNavUtil.ts#L25)

#### Parameters

| Parameter      | Type            | Default value |
| -------------- | --------------- | ------------- |
| `menu`         | `HTMLElement`   | `undefined`   |
| `menuItems`    | `HTMLElement`[] | `undefined`   |
| `isHorizontal` | `boolean`       | `true`        |

#### Returns

`WcagKeyNavUtil`

## Properties

| Property                                                                            | Modifier   | Type | Default value | Defined in                                                                                                                                                                        |
| ----------------------------------------------------------------------------------- | ---------- | ---- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-synthetic_event_button_number"></a> `SYNTHETIC_EVENT_BUTTON_NUMBER` | `readonly` | `42` | `42`          | [packages/menu/src/menubar/WcagKeyNavUtil.ts:6](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/menu/src/menubar/WcagKeyNavUtil.ts#L6) |

## Methods

### activateFirstItem()

```ts
activateFirstItem(): void;
```

Defined in: [packages/menu/src/menubar/WcagKeyNavUtil.ts:137](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/menu/src/menubar/WcagKeyNavUtil.ts#L137)

#### Returns

`void`

---

### addArrowKeyNavigation()

```ts
addArrowKeyNavigation(): void;
```

Defined in: [packages/menu/src/menubar/WcagKeyNavUtil.ts:34](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/menu/src/menubar/WcagKeyNavUtil.ts#L34)

#### Returns

`void`

---

### destroy()

```ts
destroy(): void;
```

Defined in: [packages/menu/src/menubar/WcagKeyNavUtil.ts:145](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/menu/src/menubar/WcagKeyNavUtil.ts#L145)

Clean up event listeners to prevent memory leaks.
Should be called when the navigation is no longer needed.

#### Returns

`void`
