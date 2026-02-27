[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [commands/toggle-header](../README.md) / toggleHeader

# Function: toggleHeader()

```ts
function toggleHeader(type, options?): Command;
```

Defined in: [tables/src/commands/toggle-header.ts:52](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/commands/toggle-header.ts#L52)

Toggles between row/column header and normal cells.

The behavior depends on the `type` parameter:

- `'row'`: Toggles the first row between header and regular cells
- `'column'`: Toggles the first column between header and regular cells
- `'cell'`: Toggles the currently selected cells

When `useSelectedRowColumn` is true and type is 'row' or 'column',
the command toggles the selected row/column instead of the first one.

## Parameters

| Parameter | Type                                                                                                   | Description                                              |
| --------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| `type`    | [`ToggleHeaderType`](../../../types/commands/ToggleHeaderType/type-aliases/ToggleHeaderType.md)        | The type of header to toggle: 'column', 'row', or 'cell' |
| `options` | [`ToggleHeaderOptions`](../../../types/commands/ToggleHeaderOptions/interfaces/ToggleHeaderOptions.md) | Optional configuration object                            |

## Returns

`Command`

A ProseMirror command that toggles headers

## Examples

```ts
// Toggle first row as header
toggleHeader("row");
```

```ts
// Toggle selected column as header
toggleHeader("column", { useSelectedRowColumn: true });
```
