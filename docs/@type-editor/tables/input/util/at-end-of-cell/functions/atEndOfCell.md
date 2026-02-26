[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/tables](../../../../README.md) / [input/util/at-end-of-cell](../README.md) / atEndOfCell

# Function: atEndOfCell()

```ts
function atEndOfCell(view, axis, dir): number;
```

Defined in: [tables/src/input/util/at-end-of-cell.ts:18](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/input/util/at-end-of-cell.ts#L18)

Checks whether the cursor is at the edge of a cell in the specified direction.

This is used to determine if arrow key navigation should move to an adjacent cell
rather than staying within the current cell.

## Parameters

| Parameter | Type                                                        | Description                                                         |
| --------- | ----------------------------------------------------------- | ------------------------------------------------------------------- |
| `view`    | `PmEditorView`                                              | The editor view.                                                    |
| `axis`    | [`Axis`](../../../../types/input/Axis/type-aliases/Axis.md) | The axis of movement ('horiz' for horizontal, 'vert' for vertical). |
| `dir`     | `number`                                                    | The direction of movement (-1 for left/up, 1 for right/down).       |

## Returns

`number`

The position of the cell if at its edge, or `null` if not at an edge.
