[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/menu](../../README.md) / [MenuBarBuilder](../README.md) / MenuBarBuilder

# Class: MenuBarBuilder

Defined in: [packages/menu/src/MenuBarBuilder.ts:34](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/MenuBarBuilder.ts#L34)

Builder for constructing a ProseMirror menu bar plugin.

Use `addMenuGroup` to add flat groups of items to the toolbar, and
`addDropDown` to add dropdown menus. Finish with `build()` to
produce the configured `Plugin` instance.

## Example

```ts
const plugin = new MenuBarBuilder()
  .addMenuGroup(boldItem, italicItem)
  .addDropDown({ label: "Insert" }, tableItem, imageItem)
  .build();
```

## Constructors

### Constructor

```ts
new MenuBarBuilder(isLegacy?, floating?): MenuBarBuilder;
```

Defined in: [packages/menu/src/MenuBarBuilder.ts:48](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/MenuBarBuilder.ts#L48)

Creates a new `MenuBarBuilder`.

#### Parameters

| Parameter  | Type      | Default value | Description                                                                                                                          |
| ---------- | --------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `isLegacy` | `boolean` | `false`       | When `true`, dropdowns are rendered using the legacy `DropdownLegacy` component for backward compatibility. Defaults to `false`.     |
| `floating` | `boolean` | `false`       | When `true`, the menu bar sticks to the top of the viewport while the editor is partially scrolled out of view. Defaults to `false`. |

#### Returns

`MenuBarBuilder`

## Methods

### addDropDown()

```ts
addDropDown(options?, ...menuElements): MenuBarBuilder;
```

Defined in: [packages/menu/src/MenuBarBuilder.ts:137](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/MenuBarBuilder.ts#L137)

Adds a dropdown menu group to the menu bar.

If a single pre-built `Dropdown` instance is passed as the only element,
it is added directly. Otherwise, all elements are collected and wrapped in
a new `Dropdown` (or `DropdownLegacy` when the builder is in legacy mode).

#### Parameters

| Parameter            | Type                                                                   | Description                                                                                                                  |
| -------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `options?`           | \{ `label?`: `string`; `showLabel?`: `boolean`; `title?`: `string`; \} | Optional display options for the dropdown trigger (e.g. `label` or `title`).                                                 |
| `options.label?`     | `string`                                                               | -                                                                                                                            |
| `options.showLabel?` | `boolean`                                                              | -                                                                                                                            |
| `options.title?`     | `string`                                                               | -                                                                                                                            |
| ...`menuElements?`   | [`MenuElementInput`](../type-aliases/MenuElementInput.md)[]            | One or more menu elements (or arrays thereof) to include in the dropdown. `null` / `undefined` entries are silently ignored. |

#### Returns

`MenuBarBuilder`

This builder instance for method chaining.

---

### addMenuGroup()

```ts
addMenuGroup(...menuElements): MenuBarBuilder;
```

Defined in: [packages/menu/src/MenuBarBuilder.ts:181](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/MenuBarBuilder.ts#L181)

Adds a flat group of menu elements to the menu bar.

Each group is rendered as a visually separated section of the toolbar.
Arrays within `menuElements` are flattened; `null` / `undefined` entries
are silently ignored.

#### Parameters

| Parameter         | Type                                                                                                                                                                                                                                                                                                 | Description                                                             |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| ...`menuElements` | ( \| [`Dropdown`](../../menubar/dropdown/Dropdown/classes/Dropdown.md) \| [`DropdownLegacy`](../../menubar/dropdown/DropdownLegacy/classes/DropdownLegacy.md) \| [`MenuItem`](../../menubar/MenuItem/classes/MenuItem.md) \| [`MenuElement`](../../types/MenuElement/interfaces/MenuElement.md)[])[] | One or more menu elements (or arrays thereof) to include in this group. |

#### Returns

`MenuBarBuilder`

This builder instance for method chaining.

---

### addStaticDropDown()

```ts
addStaticDropDown(options?, ...menuElements): MenuBarBuilder;
```

Defined in: [packages/menu/src/MenuBarBuilder.ts:143](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/MenuBarBuilder.ts#L143)

#### Parameters

| Parameter            | Type                                                                   |
| -------------------- | ---------------------------------------------------------------------- |
| `options?`           | \{ `label?`: `string`; `showLabel?`: `boolean`; `title?`: `string`; \} |
| `options.label?`     | `string`                                                               |
| `options.showLabel?` | `boolean`                                                              |
| `options.title?`     | `string`                                                               |
| ...`menuElements?`   | [`MenuElementInput`](../type-aliases/MenuElementInput.md)[]            |

#### Returns

`MenuBarBuilder`

---

### build()

```ts
build(): Plugin_2;
```

Defined in: [packages/menu/src/MenuBarBuilder.ts:114](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/MenuBarBuilder.ts#L114)

Builds and returns the configured menu bar `Plugin`.

#### Returns

`Plugin_2`

A ProseMirror `Plugin` that renders the menu bar.

---

### createMenuItem()

```ts
static createMenuItem(spec, useSelect?): MenuItem;
```

Defined in: [packages/menu/src/MenuBarBuilder.ts:71](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/MenuBarBuilder.ts#L71)

Creates a `MenuItem` from the given spec.

Convenience factory that handles two common omissions automatically:

- If only `label` is provided, `title` is set to the same value.
- If only `title` (as a plain string) is provided, `label` is set to the same value.

When `useSelect` is `true` and the spec defines a `run` function but no
explicit `select` guard, a `select` function is derived from `run` so that
the item is hidden whenever `run` would return `false`.

#### Parameters

| Parameter   | Type                                                                  | Default value | Description                                                                                 |
| ----------- | --------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------- |
| `spec`      | [`MenuItemSpec`](../../types/MenuItemSpec/interfaces/MenuItemSpec.md) | `undefined`   | The `MenuItemSpec` describing the item's appearance and behaviour.                          |
| `useSelect` | `boolean`                                                             | `false`       | When `true`, derives a `select` guard from `run` if none is specified. Defaults to `false`. |

#### Returns

[`MenuItem`](../../menubar/MenuItem/classes/MenuItem.md)

A new `MenuItem`, or `null` if `spec` is falsy.
