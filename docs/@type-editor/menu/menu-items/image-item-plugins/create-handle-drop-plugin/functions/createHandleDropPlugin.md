[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/menu](../../../../README.md) / [menu-items/image-item-plugins/create-handle-drop-plugin](../README.md) / createHandleDropPlugin

# Function: createHandleDropPlugin()

```ts
function createHandleDropPlugin(editorView): Plugin_2;
```

Defined in: [packages/menu/src/menu-items/image-item-plugins/create-handle-drop-plugin.ts:15](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/menu/src/menu-items/image-item-plugins/create-handle-drop-plugin.ts#L15)

Creates a plugin to handle the start of drop operations for images,
tracking metadata needed for subsequent processing.

## Parameters

| Parameter    | Type           | Description                                  |
| ------------ | -------------- | -------------------------------------------- |
| `editorView` | `PmEditorView` | The editor view for accessing document state |

## Returns

`Plugin_2`

A ProseMirror plugin that processes dropped image nodes
