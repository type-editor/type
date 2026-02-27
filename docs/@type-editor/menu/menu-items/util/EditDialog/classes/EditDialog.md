[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/menu](../../../../README.md) / [menu-items/util/EditDialog](../README.md) / EditDialog

# Class: EditDialog

Defined in: [packages/menu/src/menu-items/util/EditDialog.ts:58](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/menu/src/menu-items/util/EditDialog.ts#L58)

A utility class for creating and managing modal dialogs in the editor.
Provides a fluent API for building dialog content with rows and custom HTML.
Handles both native HTML dialog elements and fallback div elements for older browsers.

## Example

```typescript
const dialog = new EditDialog();
dialog
  .addPage("Settings")
  .add("<h2>Edit Image</h2>")
  .addRow('<label>Width:</label><input type="text" id="width" />')
  .addRow('<label>Height:</label><input type="text" id="height" />')
  .open(editorView, 400, 300);
```

## Constructors

### Constructor

```ts
new EditDialog(): EditDialog;
```

#### Returns

`EditDialog`

## Methods

### add()

```ts
add(content): EditDialog;
```

Defined in: [packages/menu/src/menu-items/util/EditDialog.ts:163](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/menu/src/menu-items/util/EditDialog.ts#L163)

Adds custom HTML content to the current dialog page.
Can be chained for fluent API usage.

Automatically creates a default page if no page exists.

#### Parameters

| Parameter | Type     | Description                           |
| --------- | -------- | ------------------------------------- |
| `content` | `string` | The HTML content to add to the dialog |

#### Returns

`EditDialog`

The current EditDialog instance for chaining

---

### addListener()

```ts
addListener(
   domElement,
   eventType,
   listener): void;
```

Defined in: [packages/menu/src/menu-items/util/EditDialog.ts:90](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/menu/src/menu-items/util/EditDialog.ts#L90)

Adds an event listener to a DOM element and tracks it for cleanup.
Supports element IDs, direct element references, or the string 'window'.

If the element cannot be resolved, the listener will not be added and
a warning will be logged to the console.

#### Parameters

| Parameter    | Type                      | Description                                             |
| ------------ | ------------------------- | ------------------------------------------------------- |
| `domElement` | `string` \| `HTMLElement` | The element ID, element reference, or 'window' string   |
| `eventType`  | `string`                  | The event type to listen for (e.g., 'click', 'keydown') |
| `listener`   | `EventListener`           | The event listener callback function                    |

#### Returns

`void`

#### Throws

If domElement is null or undefined

---

### addPage()

```ts
addPage(label): EditDialog;
```

Defined in: [packages/menu/src/menu-items/util/EditDialog.ts:194](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/menu/src/menu-items/util/EditDialog.ts#L194)

Adds a new page to the dialog with a tab button.
Each page can contain different content and is accessible via tab navigation.
The first page added is automatically set as active.

#### Parameters

| Parameter | Type     | Description                       |
| --------- | -------- | --------------------------------- |
| `label`   | `string` | The label text for the tab button |

#### Returns

`EditDialog`

The current EditDialog instance for chaining

---

### addRow()

```ts
addRow(content): EditDialog;
```

Defined in: [packages/menu/src/menu-items/util/EditDialog.ts:178](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/menu/src/menu-items/util/EditDialog.ts#L178)

Adds a content row to the dialog with proper wrapper elements.
Can be chained for fluent API usage.

Automatically creates a default page if no page exists.

#### Parameters

| Parameter | Type     | Description                            |
| --------- | -------- | -------------------------------------- |
| `content` | `string` | The HTML content to add within the row |

#### Returns

`EditDialog`

The current EditDialog instance for chaining

---

### close()

```ts
close(editorView): void;
```

Defined in: [packages/menu/src/menu-items/util/EditDialog.ts:140](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/menu/src/menu-items/util/EditDialog.ts#L140)

Closes the dialog and cleans up all event listeners.
Returns focus to the editor view.

#### Parameters

| Parameter    | Type           | Description                                    |
| ------------ | -------------- | ---------------------------------------------- |
| `editorView` | `PmEditorView` | The ProseMirror editor view to return focus to |

#### Returns

`void`

---

### open()

```ts
open(
   editorView,
   width,
   height): void;
```

Defined in: [packages/menu/src/menu-items/util/EditDialog.ts:120](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/menu/src/menu-items/util/EditDialog.ts#L120)

Opens the dialog in the editor view.
Creates the dialog element, positions it, and displays it as a modal (if supported).

#### Parameters

| Parameter    | Type           | Description                                         |
| ------------ | -------------- | --------------------------------------------------- |
| `editorView` | `PmEditorView` | The ProseMirror editor view to attach the dialog to |
| `width`      | `number`       | The width of the dialog in pixels                   |
| `height`     | `number`       | The height of the dialog in pixels                  |

#### Returns

`void`
