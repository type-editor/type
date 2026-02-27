[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/menu](../../../README.md) / [menubar/render-grouped](../README.md) / renderGrouped

# Function: renderGrouped()

```ts
function renderGrouped(
  view,
  content,
  showLabel?,
  isLegacy?,
): {
  dom: DocumentFragment;
  menuItems: HTMLElement[];
  update: (state) => boolean;
};
```

Defined in: [packages/menu/src/menubar/render-grouped.ts:21](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/menu/src/menubar/render-grouped.ts#L21)

Render the given, possibly nested, array of menu elements into a
document fragment, placing separators between them (and ensuring no
superfluous separators appear when some of the groups turn out to
be empty).

## Parameters

| Parameter   | Type                                                                                        | Default value | Description                                                                 |
| ----------- | ------------------------------------------------------------------------------------------- | ------------- | --------------------------------------------------------------------------- |
| `view`      | `PmEditorView`                                                                              | `undefined`   | The editor view instance                                                    |
| `content`   | readonly readonly [`MenuElement`](../../../types/MenuElement/interfaces/MenuElement.md)[][] | `undefined`   | A nested array of menu element groups to render                             |
| `showLabel` | `boolean`                                                                                   | `false`       | Whether to show labels for menu items (if applicable, e.g. in DropdownMenu) |
| `isLegacy`  | `boolean`                                                                                   | `false`       | Backward compatibility mode                                                 |

## Returns

```ts
{
  dom: DocumentFragment;
  menuItems: HTMLElement[];
  update: (state) => boolean;
}
```

An object containing the document fragment and an update function

| Name        | Type                   | Default value | Defined in                                                                                                                                                                            |
| ----------- | ---------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dom`       | `DocumentFragment`     | `result`      | [packages/menu/src/menubar/render-grouped.ts:117](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/menu/src/menubar/render-grouped.ts#L117) |
| `menuItems` | `HTMLElement`[]        | -             | [packages/menu/src/menubar/render-grouped.ts:119](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/menu/src/menubar/render-grouped.ts#L119) |
| `update()`  | (`state`) => `boolean` | -             | [packages/menu/src/menubar/render-grouped.ts:118](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/menu/src/menubar/render-grouped.ts#L118) |
