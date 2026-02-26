[**Type Editor**](../../README.md)

---

[Type Editor](../../index.md) / @type-editor/menu

# @type-editor/menu

A refactored version of ProseMirror's `prosemirror-menu` module, providing building blocks for creating customizable editor menus and a ready-to-use menu bar implementation.

> **Note**: This module exists primarily as an example of how you might approach adding a menu to a ProseMirror-based editor. For production use, you may want to fork and customize it to fit your specific requirements.

## Installation

```bash
npm install @type-editor/menu
```

## Overview

This module provides:

- **Menu elements**: Building blocks for creating menu items, dropdowns, and submenus
- **Menu bar plugin**: A ready-to-use plugin that adds a menu bar above the editor
- **MenuBarBuilder**: A fluent API for building menu bars with groups and dropdowns
- **Pre-built menu items**: Ready-to-use menu items for common editing operations (formatting, lists, headings, images, links, and more)
- **Helper functions**: Utilities for building block-type and wrap commands
- **Icons**: A set of SVG icons for common editor actions

## Styling

When using this module, make sure to include the menu stylesheet in your page:

```typescript
import "@type-editor/menu/style/menu.css";
```

Or link to it directly:

```html
<link rel="stylesheet" href="node_modules/@type-editor/menu/style/menu.css" />
```

## Basic Usage

### Creating a Menu Bar

```typescript
import { EditorView } from "@type-editor/view";
import { EditorState } from "@type-editor/state";
import {
  menuBarPlugin,
  MenuItem,
  Dropdown,
  icons,
  undoItem,
  redoItem,
  strongItem,
  italicItem,
  headingItem,
} from "@type-editor/menu";

// Define menu content as a nested array of menu elements
const menuContent = [
  [undoItem, redoItem], // First group: undo/redo
  [strongItem(), italicItem()], // Second group: formatting
  [headingItem("1"), headingItem("2")], // Third group: headings
];

// Create the menu bar plugin
const menuPlugin = menuBarPlugin({
  content: menuContent,
  floating: false, // Set to true for a sticky menu bar
});

// Add the plugin to your editor state
const state = EditorState.create({
  schema: mySchema,
  plugins: [menuPlugin],
});
```

### Creating Custom Menu Items

```typescript
import { MenuItem, icons } from "@type-editor/menu";
import { toggleMark } from "@type-editor/commands";

const boldItem = new MenuItem({
  title: "Toggle bold",
  icon: icons.strong,
  run: toggleMark(schema.marks.strong),
  enable: (state) => toggleMark(schema.marks.strong)(state),
  active: (state) => {
    const { from, $from, to, empty } = state.selection;
    return empty
      ? !!schema.marks.strong.isInSet(state.storedMarks || $from.marks())
      : state.doc.rangeHasMark(from, to, schema.marks.strong);
  },
});
```

### Using Dropdowns

```typescript
import { Dropdown, blockTypeItem } from "@type-editor/menu";

const headingDropdown = new Dropdown(
  [
    blockTypeItem(schema.nodes.heading, {
      attrs: { level: 1 },
      label: "Heading 1",
    }),
    blockTypeItem(schema.nodes.heading, {
      attrs: { level: 2 },
      label: "Heading 2",
    }),
    blockTypeItem(schema.nodes.paragraph, { label: "Paragraph" }),
  ],
  { label: "Type", title: "Change block type" },
);
```

### Using Submenu Dropdowns

```typescript
import { DropdownSubmenu, wrapItem, icons } from "@type-editor/menu";

const wrapSubmenu = new DropdownSubmenu(
  [
    wrapItem(schema.nodes.blockquote, {
      label: "Blockquote",
      icon: icons.blockquote,
    }),
    wrapItem(schema.nodes.code_block, {
      label: "Code Block",
      icon: icons.code,
    }),
  ],
  { label: "Wrap in..." },
);
```

### Using MenuBarBuilder

The `MenuBarBuilder` class provides a fluent API for constructing menu bars:

```typescript
import {
  MenuBarBuilder,
  undoItem,
  redoItem,
  strongItem,
  italicItem,
  headingItem,
  paragraphItem,
} from "@type-editor/menu";

const menuPlugin = new MenuBarBuilder(false, false) // (isLegacy, floating)
  .addMenuGroup(undoItem, redoItem)
  .addMenuGroup(strongItem(), italicItem())
  .addDropDown({ title: "Block Type", label: "Type" }, [
    paragraphItem(),
    headingItem("1"),
    headingItem("2"),
    headingItem("3"),
  ])
  .build();
```

## API Reference

### MenuElement Interface

Any object that conforms to this interface can be used in a menu:

```typescript
interface MenuElement {
  render(view: EditorView): {
    dom: HTMLElement;
    update: (state: EditorState) => boolean;
  };
}
```

### MenuItem Class

Creates a clickable menu item that executes a command.

```typescript
new MenuItem(spec: MenuItemSpec)
```

#### MenuItemSpec Properties

| Property | Type                                     | Description                                                                                |
| -------- | ---------------------------------------- | ------------------------------------------------------------------------------------------ |
| `run`    | `(state, dispatch, view, event) => void` | **Required.** The command to execute when clicked.                                         |
| `select` | `(state) => boolean`                     | If provided and returns `false`, the item is hidden.                                       |
| `enable` | `(state) => boolean`                     | If provided and returns `false`, the item is disabled.                                     |
| `active` | `(state) => boolean`                     | Returns `true` when the item should appear "active" (e.g., bold toggle when in bold text). |
| `icon`   | `IconSpec`                               | An icon specification for the item.                                                        |
| `label`  | `string`                                 | Text label for the item (useful in dropdowns).                                             |
| `title`  | `string \| (state) => string`            | Tooltip text.                                                                              |
| `render` | `(view) => HTMLElement`                  | Custom render function.                                                                    |
| `class`  | `string`                                 | Additional CSS class.                                                                      |
| `css`    | `string`                                 | Inline CSS styles.                                                                         |

### Dropdown Class

Creates a dropdown menu with a label and expandable content.

```typescript
new Dropdown(
  content: MenuElement[] | MenuElement,
  options?: {
    label?: string;
    title?: string;
    class?: string;
    css?: string;
  }
)
```

### DropdownSubmenu Class

Creates a submenu that expands to the right on hover.

```typescript
new DropdownSubmenu(
  content: MenuElement[] | MenuElement,
  options?: {
    label?: string;
    title?: string;
    class?: string;
    css?: string;
  }
)
```

### menuBarPlugin Function

Creates a plugin that adds a menu bar above the editor.

```typescript
function menuBarPlugin(options: MenuBarOptions): Plugin;
```

#### MenuBarOptions

| Property   | Type              | Default | Description                                                                                                 |
| ---------- | ----------------- | ------- | ----------------------------------------------------------------------------------------------------------- |
| `content`  | `MenuElement[][]` | —       | **Required.** Nested array of menu elements. Each inner array becomes a group separated by visual dividers. |
| `floating` | `boolean`         | `false` | When `true`, the menu bar sticks to the top of the viewport when scrolling.                                 |

### MenuBarBuilder Class

A fluent builder class for constructing menu bars with groups and dropdowns.

```typescript
new MenuBarBuilder(isLegacy?: boolean, floating?: boolean)
```

#### Constructor Parameters

| Parameter  | Type      | Default | Description                                                            |
| ---------- | --------- | ------- | ---------------------------------------------------------------------- |
| `isLegacy` | `boolean` | `false` | When `true`, uses legacy dropdown rendering (DropdownLegacy).          |
| `floating` | `boolean` | `false` | When `true`, the menu bar sticks to the top of the viewport on scroll. |

#### Methods

| Method                           | Parameters                                                                       | Return           | Description                                                                             |
| -------------------------------- | -------------------------------------------------------------------------------- | ---------------- | --------------------------------------------------------------------------------------- |
| `addMenuGroup(...items)`         | `MenuItem`, `Dropdown`, `DropdownLegacy`, or arrays thereof                      | `MenuBarBuilder` | Adds a group of menu items. Items in the same group appear together without separators. |
| `addDropDown(options, ...items)` | `options: { title?: string, label?: string }`, items: `MenuItem[]` or `Dropdown` | `MenuBarBuilder` | Adds a dropdown menu with the given title/label and items.                              |
| `build()`                        | —                                                                                | `Plugin`         | Creates and returns the configured menu bar plugin.                                     |

#### Example

```typescript
import {
  MenuBarBuilder,
  undoItem,
  redoItem,
  strongItem,
  italicItem,
  codeItem,
  headingItem,
  paragraphItem,
  bulletListItem,
  orderedListItem,
} from "@type-editor/menu";

const menuPlugin = new MenuBarBuilder(false, false)
  .addMenuGroup(undoItem, redoItem)
  .addMenuGroup(strongItem(), italicItem(), codeItem())
  .addDropDown({ title: "Block Type", label: "Type" }, [
    paragraphItem(),
    headingItem("1"),
    headingItem("2"),
    headingItem("3"),
  ])
  .addDropDown({ title: "Lists", label: "Lists" }, [
    bulletListItem(),
    orderedListItem(),
  ])
  .build();
```

### Pre-built Menu Items

The following menu item functions create ready-to-use `MenuItem` instances:

#### Text Formatting

| Function                                              | Description                        | Parameters                                                                             |
| ----------------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------- |
| `strongItem(title?, markType?)`                       | Toggle bold/strong formatting.     | `title` (default: 'Bold'), `markType` (default: `schema.marks.strong`)                 |
| `italicItem(title?, markType?)`                       | Toggle italic/emphasis formatting. | `title` (default: 'Italic'), `markType` (default: `schema.marks.em`)                   |
| `codeItem(title?, markType?)`                         | Toggle inline code formatting.     | `title` (default: 'Code'), `markType` (default: `schema.marks.code`)                   |
| `strikethroughItem(title?, markType?)`                | Toggle strikethrough formatting.   | `title` (default: 'Strikethrough'), `markType` (default: `schema.marks.strikethrough`) |
| `subscriptItem(title?, markType?)`                    | Toggle subscript formatting.       | `title` (default: 'Subscript'), `markType` (default: `schema.marks.subscript`)         |
| `superscriptItem(title?, markType?)`                  | Toggle superscript formatting.     | `title` (default: 'Superscript'), `markType` (default: `schema.marks.superscript`)     |
| `linkItem(title?, linkMarkType?, codeBlockNodeType?)` | Insert or edit links.              | `title` (default: 'Link'), `linkMarkType` (default: `schema.marks.link`)               |

#### Block Types

| Function                                                     | Description                      | Parameters                                                                       |
| ------------------------------------------------------------ | -------------------------------- | -------------------------------------------------------------------------------- |
| `paragraphItem(title?, nodeType?, ulNodeType?, olNodeType?)` | Change block to paragraph.       | `title` (default: 'Paragraph'), `nodeType` (default: `schema.nodes.paragraph`)   |
| `headingItem(level?, title?, nodeType?, codeBlockNodeType?)` | Change block to heading (h1-h6). | `level` ('1'-'6', default: '1'), `title` (default: 'Heading {level}')            |
| `codeBlockItem(title?, nodeType?, unwrapNodeType?)`          | Toggle code block.               | `title` (default: 'Code Block'), `nodeType` (default: `schema.nodes.code_block`) |
| `blockquoteItem(title?, nodeType?)`                          | Toggle blockquote wrap.          | `title` (default: 'Blockquote'), `nodeType` (default: `schema.nodes.blockquote`) |

#### Lists

| Function                                            | Description           | Parameters                                                                              |
| --------------------------------------------------- | --------------------- | --------------------------------------------------------------------------------------- |
| `bulletListItem(title?, ulNodeType?, olNodeType?)`  | Toggle bullet list.   | `title` (default: 'Bullet List'), `ulNodeType` (default: `schema.nodes.bullet_list`)    |
| `orderedListItem(title?, olNodeType?, ulNodeType?)` | Toggle numbered list. | `title` (default: 'Numbered List'), `olNodeType` (default: `schema.nodes.ordered_list`) |

#### Alignment

| Function                                                                  | Description         | Parameters                                                                                      |
| ------------------------------------------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------- |
| `alignItem(align?, title?, codeBlockNodeType?, ulNodeType?, olNodeType?)` | Set text alignment. | `align` ('left', 'right', 'center', 'justify', default: 'left'), `title` (default: align value) |

#### Media & Files

| Function                                                       | Description                                     | Parameters                                                                                 |
| -------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `imageItem(title?, imgType?, figureType?, codeBlockNodeType?)` | Insert or edit images.                          | `title` (default: 'Image'), `imgType` (default: `schema.nodes.image`)                      |
| `fileUploadItem(title?, fileType?, codeBlockNodeType?)`        | Upload and attach files with thumbnail preview. | `title` (default: 'File Upload'), `fileType` (default: `schema.marks.file`)                |
| `horizontalRuleItem(title?, nodeType?, codeBlockNodeType?)`    | Insert horizontal rule.                         | `title` (default: 'Horizontal Rule'), `nodeType` (default: `schema.nodes.horizontal_rule`) |

#### History & Structure

| Function               | Description                            | Parameters |
| ---------------------- | -------------------------------------- | ---------- |
| `undoItem`             | Undo the last action.                  | —          |
| `redoItem`             | Redo the last undone action.           | —          |
| `joinUpItem`           | Join current block with the one above. | —          |
| `liftItem`             | Lift content out of its parent.        | —          |
| `selectParentNodeItem` | Select the parent node.                | —          |

### Helper Functions

#### wrapItem

```typescript
function wrapItem(
  nodeType: NodeType,
  options: Partial<MenuItemSpec> & { attrs?: Attrs },
): MenuItem;
```

Creates a menu item that wraps the selection in the given node type (e.g., blockquote, list).

#### blockTypeItem

```typescript
function blockTypeItem(
  nodeType: NodeType,
  options: Partial<MenuItemSpec> & { attrs?: Attrs },
): MenuItem;
```

Creates a menu item that changes the current textblock to the given type (e.g., heading, paragraph).

#### renderGrouped

```typescript
function renderGrouped(
  view: EditorView,
  content: MenuElement[][],
): { dom: DocumentFragment; update: (state: EditorState) => boolean };
```

Renders a nested array of menu elements into a document fragment with separators between groups.

### Icons

A set of SVG icons for common editor actions:

```typescript
import { icons } from "@type-editor/menu";

// Available icons:
icons.join; // Join blocks
icons.lift; // Lift out of parent
icons.selectParentNode;
icons.undo;
icons.redo;
icons.strong; // Bold
icons.em; // Italic
icons.strikethrough; // Strikethrough
icons.code; // Inline code
icons.codeBlock; // Code block
icons.link; // Link
icons.bulletList;
icons.orderedList;
icons.blockquote;
icons.headings; // Generic heading
(icons.h1, icons.h2, icons.h3, icons.h4, icons.h5, icons.h6);
icons.paragraph;
icons.image;
icons.file; // File attachment
icons.horizontalRule;
icons.textBlock;
(icons.alignLeft, icons.alignCenter, icons.alignRight, icons.alignJustify);
icons.subscript;
icons.superscript;
```

### IconSpec Type

Icons can be specified in three ways:

```typescript
type IconSpec =
  | { path: string; width: number; height: number } // SVG path
  | { text: string; css?: string } // Text character
  | { dom: Node }; // Custom DOM node
```

## PDF.js Worker Configuration

The `fileUploadItem` uses PDF.js to generate preview images for PDF files. By default, it uses a CDN-hosted worker file for maximum compatibility. However, for production environments, you should configure a local copy of the worker file:

```typescript
import { GlobalWorkerOptions } from "pdfjs-dist";

// Set this before your editor initializes
GlobalWorkerOptions.workerSrc = "/path/to/pdf.worker.min.mjs";
```

### Option 1: Copy worker from node_modules

Copy the worker file from your `node_modules` to your public directory:

```bash
cp node_modules/pdfjs-dist/build/pdf.worker.min.mjs public/
```

Then set the worker path:

```typescript
GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
```

### Option 2: Vite Configuration

If you're using Vite, you can configure it to copy the worker file automatically:

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import { copyFileSync } from "fs";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    {
      name: "copy-pdf-worker",
      writeBundle() {
        copyFileSync(
          resolve("node_modules/pdfjs-dist/build/pdf.worker.min.mjs"),
          resolve("dist/pdf.worker.min.mjs"),
        );
      },
    },
  ],
});
```

## License

MIT

## Modules

<table>
<thead>
<tr>
<th>Module</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[css-classes](css-classes/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-bar-plugin](menu-bar-plugin/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/align-item](menu-items/align-item/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/blockquote-item](menu-items/blockquote-item/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/bullet-list-item](menu-items/bullet-list-item/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/code-block-item](menu-items/code-block-item/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/code-item](menu-items/code-item/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/file-upload-item](menu-items/file-upload-item/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/file-upload/DOMToImage](menu-items/file-upload/DOMToImage/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/file-upload/ThumbnailGenerator](menu-items/file-upload/ThumbnailGenerator/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/heading-item](menu-items/heading-item/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/horizontal-rule-item](menu-items/horizontal-rule-item/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/image-item](menu-items/image-item/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/image-item-plugins/create-handle-drop-finished-plugin](menu-items/image-item-plugins/create-handle-drop-finished-plugin/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/image-item-plugins/create-handle-drop-plugin](menu-items/image-item-plugins/create-handle-drop-plugin/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/image-item-plugins/create-handle-paste-plugin](menu-items/image-item-plugins/create-handle-paste-plugin/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/image-item-plugins/PluginKeys](menu-items/image-item-plugins/PluginKeys/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/italic-item](menu-items/italic-item/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/join-up-item](menu-items/join-up-item/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/lift-item](menu-items/lift-item/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/link-item](menu-items/link-item/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/ordered-list-item](menu-items/ordered-list-item/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/paragraph-item](menu-items/paragraph-item/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/redo-item](menu-items/redo-item/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/select-parent-node-item](menu-items/select-parent-node-item/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/strikethrough-item](menu-items/strikethrough-item/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/strong-item](menu-items/strong-item/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/subscript-item](menu-items/subscript-item/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/superscript-item](menu-items/superscript-item/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/undo-item](menu-items/undo-item/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/util/block-type-item](menu-items/util/block-type-item/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/util/document-is-not-empty](menu-items/util/document-is-not-empty/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/util/drag-drop-helper](menu-items/util/drag-drop-helper/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/util/EditDialog](menu-items/util/EditDialog/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/util/is-in-list](menu-items/util/is-in-list/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/util/is-len-in-range](menu-items/util/is-len-in-range/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/util/is-mark-active](menu-items/util/is-mark-active/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/util/is-node-active](menu-items/util/is-node-active/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/util/wrap-item](menu-items/util/wrap-item/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menu-items/vite-env](menu-items/vite-env/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menubar/dropdown/AbstractDropdownMenu](menubar/dropdown/AbstractDropdownMenu/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menubar/dropdown/Dropdown](menubar/dropdown/Dropdown/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menubar/dropdown/DropdownLegacy](menubar/dropdown/DropdownLegacy/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menubar/dropdown/DropdownSubmenu](menubar/dropdown/DropdownSubmenu/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menubar/icons/get-icon](menubar/icons/get-icon/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menubar/icons/icons](menubar/icons/icons/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menubar/icons/icons-prosemirror](menubar/icons/icons-prosemirror/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menubar/MenuBarView](menubar/MenuBarView/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menubar/MenuItem](menubar/MenuItem/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menubar/render-grouped](menubar/render-grouped/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menubar/util/combine-updates](menubar/util/combine-updates/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menubar/util/create-html-element](menubar/util/create-html-element/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[menubar/WcagKeyNavUtil](menubar/WcagKeyNavUtil/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[MenuBarBuilder](MenuBarBuilder/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/DropdownMenuOptions](types/DropdownMenuOptions/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/Icon](types/Icon/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/IconSpec](types/IconSpec/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/MenuBarOptions](types/MenuBarOptions/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/MenuElement](types/MenuElement/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/MenuItemSpec](types/MenuItemSpec/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/ParentMenuElement](types/ParentMenuElement/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/SubMenuOptions](types/SubMenuOptions/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[util/set-class](util/set-class/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[util/translate](util/translate/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
</tbody>
</table>
