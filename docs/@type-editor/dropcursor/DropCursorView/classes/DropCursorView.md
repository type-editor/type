[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dropcursor](../../README.md) / [DropCursorView](../README.md) / DropCursorView

# Class: DropCursorView

Defined in: [DropCursorView.ts:31](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/dropcursor/src/DropCursorView.ts#L31)

View implementation for the drop cursor plugin.
Manages the visual drop cursor element and handles drag-and-drop events.

## Constructors

### Constructor

```ts
new DropCursorView(editorView, options): DropCursorView;
```

Defined in: [DropCursorView.ts:66](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/dropcursor/src/DropCursorView.ts#L66)

Creates a new drop cursor view.

#### Parameters

| Parameter    | Type                                                                                 | Description                                 |
| ------------ | ------------------------------------------------------------------------------------ | ------------------------------------------- |
| `editorView` | `PmEditorView`                                                                       | The ProseMirror editor view instance        |
| `options`    | [`DropCursorOptions`](../../types/DropCursorOptions/interfaces/DropCursorOptions.md) | Configuration options for cursor appearance |

#### Returns

`DropCursorView`

## Properties

| Property                                      | Modifier   | Type           | Description                          | Defined in                                                                                                                                              |
| --------------------------------------------- | ---------- | -------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-editorview"></a> `editorView` | `readonly` | `PmEditorView` | The ProseMirror editor view instance | [DropCursorView.ts:66](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/dropcursor/src/DropCursorView.ts#L66) |

## Methods

### destroy()

```ts
destroy(): void;
```

Defined in: [DropCursorView.ts:79](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/dropcursor/src/DropCursorView.ts#L79)

Cleans up the drop cursor view by removing event listeners and DOM elements.
Called automatically when the plugin is destroyed.

#### Returns

`void`

---

### update()

```ts
update(editorView, prevState): void;
```

Defined in: [DropCursorView.ts:94](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/dropcursor/src/DropCursorView.ts#L94)

Updates the drop cursor when the editor state changes.
Removes the cursor if its position becomes invalid, or updates its visual position.

#### Parameters

| Parameter    | Type           | Description                                 |
| ------------ | -------------- | ------------------------------------------- |
| `editorView` | `PmEditorView` | The updated editor view                     |
| `prevState`  | `EditorState`  | The previous editor state before the update |

#### Returns

`void`
