[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/menu](../../../README.md) / [menubar/MenuBarView](../README.md) / MenuBarView

# Class: MenuBarView

Defined in: [packages/menu/src/menubar/MenuBarView.ts:19](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menubar/MenuBarView.ts#L19)

View class that manages the menu bar display and behavior.

Handles DOM structure, floating behavior, scroll events, and menu updates.
The menu bar can float at the top of the viewport when scrolling, and
automatically adjusts its position and visibility.

## Constructors

### Constructor

```ts
new MenuBarView(editorView, options): MenuBarView;
```

Defined in: [packages/menu/src/menubar/MenuBarView.ts:79](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menubar/MenuBarView.ts#L79)

Creates a new MenuBarView instance.

Sets up the DOM structure, initializes the menu content, and
optionally configures floating behavior with scroll listeners.

#### Parameters

| Parameter    | Type                                                                           | Description                    |
| ------------ | ------------------------------------------------------------------------------ | ------------------------------ |
| `editorView` | `PmEditorView`                                                                 | The ProseMirror editor view    |
| `options`    | [`MenuBarOptions`](../../../types/MenuBarOptions/interfaces/MenuBarOptions.md) | Menu bar configuration options |

#### Returns

`MenuBarView`

## Methods

### destroy()

```ts
destroy(): void;
```

Defined in: [packages/menu/src/menubar/MenuBarView.ts:448](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menubar/MenuBarView.ts#L448)

Cleans up the menu bar view when the plugin is destroyed.

Restores the original DOM structure by removing the wrapper element
and placing the editor DOM back in its original location.
Also removes all event listeners to prevent memory leaks.

#### Returns

`void`

---

### update()

```ts
update(): void;
```

Defined in: [packages/menu/src/menubar/MenuBarView.ts:141](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menubar/MenuBarView.ts#L141)

Updates the menu bar content and layout.

This method is called by ProseMirror on editor state changes.
It handles:

- Rebuilding menu content if the root document has changed
- Updating menu item states based on current editor state
- Managing menu height to prevent layout shifts
- Scrolling the cursor into view when menu is floating

#### Returns

`void`
