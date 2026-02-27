[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [input/handle-triple-click](../README.md) / handleTripleClick

# Function: handleTripleClick()

```ts
function handleTripleClick(view, pos): boolean;
```

Defined in: [tables/src/input/handle-triple-click.ts:28](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/input/handle-triple-click.ts#L28)

Handles triple-click events to select an entire table cell.

When the user triple-clicks inside a table cell, this selects the entire cell
by creating a [CellSelection](../../../cellselection/CellSelection/classes/CellSelection.md) for that cell.

## Parameters

| Parameter | Type           | Description                                            |
| --------- | -------------- | ------------------------------------------------------ |
| `view`    | `PmEditorView` | The editor view.                                       |
| `pos`     | `number`       | The document position where the triple-click occurred. |

## Returns

`boolean`

`true` if a cell was selected, `false` if the position is not in a cell.

## Example

```typescript
// Use in a ProseMirror plugin
new Plugin({
  props: {
    handleTripleClick: handleTripleClick,
  },
});
```
