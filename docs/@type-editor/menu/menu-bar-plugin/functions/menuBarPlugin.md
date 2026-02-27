[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/menu](../../README.md) / [menu-bar-plugin](../README.md) / menuBarPlugin

# Function: menuBarPlugin()

```ts
function menuBarPlugin(options): Plugin_2;
```

Defined in: [packages/menu/src/menu-bar-plugin.ts:20](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/menu/src/menu-bar-plugin.ts#L20)

A plugin that will place a menu bar above the editor. Note that
this involves wrapping the editor in an additional `<div>`.

The menu bar can optionally float at the top of the viewport when
the editor is scrolled partially out of view (on non-iOS devices).

## Parameters

| Parameter | Type                                                                        | Description                            |
| --------- | --------------------------------------------------------------------------- | -------------------------------------- |
| `options` | [`MenuBarOptions`](../../types/MenuBarOptions/interfaces/MenuBarOptions.md) | Configuration options for the menu bar |

## Returns

`Plugin_2`

A ProseMirror plugin that manages the menu bar
