[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/tables](../../../../README.md) / [types/columnresizing/ColumnResizingOptions](../README.md) / ColumnResizingOptions

# Interface: ColumnResizingOptions

Defined in: [tables/src/types/columnresizing/ColumnResizingOptions.ts:7](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/columnresizing/ColumnResizingOptions.ts#L7)

Configuration options for the column resizing plugin.

## Properties

| Property                                                         | Type                                           | Description                                                                                                                                                                            | Defined in                                                                                                                                                                                                             |
| ---------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-cellminwidth"></a> `cellMinWidth?`               | `number`                                       | Minimum width of a cell/column in pixels. The column cannot be resized smaller than this. **Default** `25`                                                                             | [tables/src/types/columnresizing/ColumnResizingOptions.ts:18](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/columnresizing/ColumnResizingOptions.ts#L18) |
| <a id="property-defaultcellminwidth"></a> `defaultCellMinWidth?` | `number`                                       | The default minimum width of a cell/column in pixels when it doesn't have an explicit width (i.e., it has not been resized manually). **Default** `100`                                | [tables/src/types/columnresizing/ColumnResizingOptions.ts:24](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/columnresizing/ColumnResizingOptions.ts#L24) |
| <a id="property-handlewidth"></a> `handleWidth?`                 | `number`                                       | The width in pixels of the resize handle zone at column edges. When the mouse is within this distance from a column edge, the resize handle becomes active. **Default** `5`            | [tables/src/types/columnresizing/ColumnResizingOptions.ts:13](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/columnresizing/ColumnResizingOptions.ts#L13) |
| <a id="property-lastcolumnresizable"></a> `lastColumnResizable?` | `boolean`                                      | Whether the last column of the table can be resized. **Default** `true`                                                                                                                | [tables/src/types/columnresizing/ColumnResizingOptions.ts:29](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/columnresizing/ColumnResizingOptions.ts#L29) |
| <a id="property-view"></a> `View?`                               | (`node`, `cellMinWidth`, `view`) => `NodeView` | A custom node view constructor for rendering table nodes. By default, the plugin uses the TableView class. Set this to `null` to disable the custom node view. **Default** `TableView` | [tables/src/types/columnresizing/ColumnResizingOptions.ts:35](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/columnresizing/ColumnResizingOptions.ts#L35) |
