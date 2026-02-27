[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/menu](../../../README.md) / [types/MenuBarOptions](../README.md) / MenuBarOptions

# Interface: MenuBarOptions

Defined in: [packages/menu/src/types/MenuBarOptions.ts:6](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/menu/src/types/MenuBarOptions.ts#L6)

Configuration options for the menu bar plugin.

## Properties

| Property                                     | Type                                                                               | Description                                                                                                                                                  | Defined in                                                                                                                                                                      |
| -------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-content"></a> `content`      | readonly readonly [`MenuElement`](../../MenuElement/interfaces/MenuElement.md)[][] | Provides the content of the menu, as a nested array to be passed to `renderGrouped`.                                                                         | [packages/menu/src/types/MenuBarOptions.ts:12](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/menu/src/types/MenuBarOptions.ts#L12) |
| <a id="property-floating"></a> `floating?`   | `boolean`                                                                          | Determines whether the menu floats, i.e. whether it sticks to the top of the viewport when the editor is partially scrolled out of view. **Default** `false` | [packages/menu/src/types/MenuBarOptions.ts:21](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/menu/src/types/MenuBarOptions.ts#L21) |
| <a id="property-islegacy"></a> `isLegacy?`   | `boolean`                                                                          | Backward compatibility flag to enable legacy menu rendering.                                                                                                 | [packages/menu/src/types/MenuBarOptions.ts:31](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/menu/src/types/MenuBarOptions.ts#L31) |
| <a id="property-showlabel"></a> `showLabel?` | `boolean`                                                                          | Determines whether to show labels for menu items (if applicable, e.g. in DropdownMenu).                                                                      | [packages/menu/src/types/MenuBarOptions.ts:26](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/menu/src/types/MenuBarOptions.ts#L26) |
