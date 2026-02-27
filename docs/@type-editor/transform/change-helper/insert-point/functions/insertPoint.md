[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [change-helper/insert-point](../README.md) / insertPoint

# Function: insertPoint()

```ts
function insertPoint(doc, pos, nodeType): number;
```

Defined in: [packages/transform/src/change-helper/insert-point.ts:15](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/change-helper/insert-point.ts#L15)

Try to find a point where a node of the given type can be inserted
near `pos`, by searching up the node hierarchy when `pos` itself
isn't a valid place but is at the start or end of a node. Return
null if no position was found.

## Parameters

| Parameter  | Type       | Description                           |
| ---------- | ---------- | ------------------------------------- |
| `doc`      | `Node_2`   | The document to search in.            |
| `pos`      | `number`   | The position to start searching from. |
| `nodeType` | `NodeType` | The type of node to insert.           |

## Returns

`number`

A valid insertion position, or null if none found.
