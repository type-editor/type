[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/menu](../../../README.md) / [menu-items/image-item](../README.md) / imageItem

# Function: imageItem()

```ts
function imageItem(title?, imgType?, figureType?, codeBlockNodeType?): MenuItem;
```

Defined in: [packages/menu/src/menu-items/image-item.ts:92](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/menu/src/menu-items/image-item.ts#L92)

Creates a menu item for inserting and editing images in the editor.

This menu item provides functionality to:

- Insert new images via file picker or drag-and-drop
- Edit existing image properties (caption, size, text flow)
- Handle conversion between paragraph and figure nodes based on caption presence

## Parameters

| Parameter           | Type       | Default value             | Description                                                                                       |
| ------------------- | ---------- | ------------------------- | ------------------------------------------------------------------------------------------------- |
| `title`             | `string`   | `'Image'`                 | Display title for the menu item (default: 'Image')                                                |
| `imgType`           | `NodeType` | `schema.nodes.image`      | Node type for images (default: schema.nodes.image)                                                |
| `figureType`        | `NodeType` | `schema.nodes.figure`     | Node type for figures with captions (default: schema.nodes.figure)                                |
| `codeBlockNodeType` | `NodeType` | `schema.nodes.code_block` | used to identify code blocks where image insertion is disabled (default: schema.nodes.code_block) |

## Returns

[`MenuItem`](../../../menubar/MenuItem/classes/MenuItem.md)

A configured MenuItem instance
