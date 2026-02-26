[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [tableview/update-columns-on-resize](../README.md) / updateColumnsOnResize

# Function: updateColumnsOnResize()

```ts
function updateColumnsOnResize(
  node,
  colgroup,
  table,
  defaultCellMinWidth,
  overrideCol?,
  overrideValue?,
): void;
```

Defined in: [tables/src/tableview/update-columns-on-resize.ts:39](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/tableview/update-columns-on-resize.ts#L39)

Updates the column widths of a table's colgroup to match the document state.

This function synchronizes the visual column widths (via `<col>` elements in the colgroup)
with the column width attributes stored in the table cells. It handles:

- Creating new `<col>` elements when needed
- Updating existing `<col>` element widths
- Removing excess `<col>` elements
- Setting the table's overall width or min-width based on column configuration

## Parameters

| Parameter             | Type                  | Description                                                                         |
| --------------------- | --------------------- | ----------------------------------------------------------------------------------- |
| `node`                | `Node_2`              | The table node from the document.                                                   |
| `colgroup`            | `HTMLTableColElement` | The HTML colgroup element to update.                                                |
| `table`               | `HTMLTableElement`    | The HTML table element to update width on.                                          |
| `defaultCellMinWidth` | `number`              | The default minimum width in pixels for cells without explicit widths.              |
| `overrideCol?`        | `number`              | Optional column index whose width should be overridden (used during drag resizing). |
| `overrideValue?`      | `number`              | Optional width value to use for the overrideCol (used during drag resizing).        |

## Returns

`void`
