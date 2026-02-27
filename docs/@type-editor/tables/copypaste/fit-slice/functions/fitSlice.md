[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [copypaste/fit-slice](../README.md) / fitSlice

# Function: fitSlice()

```ts
function fitSlice(nodeType, slice): Node_2;
```

Defined in: [tables/src/copypaste/fit-slice.ts:16](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/copypaste/fit-slice.ts#L16)

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
