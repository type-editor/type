[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/query](../README.md) / isCellSelection

# Function: isCellSelection()

```ts
function isCellSelection(value): value is CellSelection;
```

Defined in: [tables/src/utils/query.ts:70](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/utils/query.ts#L70)

Type guard to check if a value is a [CellSelection](../../../cellselection/CellSelection/classes/CellSelection.md) instance.

This function safely determines whether an unknown value is a cell selection,
enabling type-safe access to cell selection properties and methods.

## Parameters

| Parameter | Type      | Description         |
| --------- | --------- | ------------------- |
| `value`   | `unknown` | The value to check. |

## Returns

`value is CellSelection`

`true` if the value is a `CellSelection` instance, `false` otherwise.

## Example

```typescript
if (isCellSelection(editor.state.selection)) {
  const anchorCell = editor.state.selection.$anchorCell;
  const headCell = editor.state.selection.$headCell;
}
```
