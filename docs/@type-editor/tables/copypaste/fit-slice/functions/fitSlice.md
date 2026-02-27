[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [copypaste/fit-slice](../README.md) / fitSlice

# Function: fitSlice()

```ts
function fitSlice(nodeType, slice): Node_2;
```

Defined in: [tables/src/copypaste/fit-slice.ts:16](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/tables/src/copypaste/fit-slice.ts#L16)

Fits a slice into a node of the given type.

Creates an empty node of the specified type and replaces its content
with the slice content. This is useful for normalizing partial cell
selections into complete cells.

## Parameters

| Parameter  | Type       | Description                              |
| ---------- | ---------- | ---------------------------------------- |
| `nodeType` | `NodeType` | The node type to create and fill.        |
| `slice`    | `Slice`    | The slice containing the content to fit. |

## Returns

`Node_2`

A new node containing the fitted slice content.
