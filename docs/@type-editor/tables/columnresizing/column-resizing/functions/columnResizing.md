[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [columnresizing/column-resizing](../README.md) / columnResizing

# Function: columnResizing()

```ts
function columnResizing(columnResizingOptions?): Plugin_2;
```

Defined in: [tables/src/columnresizing/column-resizing.ts:55](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/tables/src/columnresizing/column-resizing.ts#L55)

Creates a plugin that allows users to resize table columns by dragging the edges
of column cells. The plugin provides visual feedback via decorations and updates
the column width attributes in the document.

## Parameters

| Parameter               | Type                                                                                                               | Description                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| `columnResizingOptions` | [`ColumnResizingOptions`](../../../types/columnresizing/ColumnResizingOptions/interfaces/ColumnResizingOptions.md) | Configuration options for the column resizing behavior. |

## Returns

`Plugin_2`

A ProseMirror plugin that handles column resizing.

## Example

```typescript
const plugins = [
  columnResizing({
    handleWidth: 5,
    cellMinWidth: 25,
    lastColumnResizable: true,
  }),
  // ... other plugins
];
```
