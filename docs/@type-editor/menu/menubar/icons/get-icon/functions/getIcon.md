[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/menu](../../../../README.md) / [menubar/icons/get-icon](../README.md) / getIcon

# Function: getIcon()

```ts
function getIcon(root, icon, title, showLabel?, isLegacy?): HTMLElement;
```

Defined in: [packages/menu/src/menubar/icons/get-icon.ts:38](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/menu/src/menubar/icons/get-icon.ts#L38)

Creates an HTML element representation of an icon.
Supports three icon types: SVG-based, DOM-based, and text-based.

## Parameters

| Parameter   | Type                                                  | Default value | Description                                                                 |
| ----------- | ----------------------------------------------------- | ------------- | --------------------------------------------------------------------------- |
| `root`      | `Document` \| `ShadowRoot`                            | `undefined`   | The root element (Document or ShadowRoot) where the icon will be created    |
| `icon`      | [`Icon`](../../../../types/Icon/type-aliases/Icon.md) | `undefined`   | The icon configuration object                                               |
| `title`     | `string`                                              | `undefined`   | The title attribute for accessibility                                       |
| `showLabel` | `boolean`                                             | `false`       | Whether to show the label (title) alongside the icon (e.g. in DropdownMenu) |
| `isLegacy`  | `boolean`                                             | `false`       | Backward compatibility mode                                                 |

## Returns

`HTMLElement`

An HTMLElement containing the rendered icon
