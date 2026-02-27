[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/util](../../README.md) / [find-parent](../README.md) / findParentByType

# Function: findParentByType()

```ts
function findParentByType(selection, nodeType): FindParentResult;
```

Defined in: [find-parent.ts:62](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/util/src/find-parent.ts#L62)

Finds the nearest ancestor node of a specific type.

This is a convenience wrapper around [findParent](findParent.md) that matches nodes by their type.

## Parameters

| Parameter   | Type          | Description                                  |
| ----------- | ------------- | -------------------------------------------- |
| `selection` | `PmSelection` | The current editor selection to search from. |
| `nodeType`  | `NodeType`    | The node type to search for.                 |

## Returns

[`FindParentResult`](../../types/FindParentResult/interfaces/FindParentResult.md)

The matching parent node with its resolved position, or `null` if no match is found.

## Example

```typescript
// Find the nearest paragraph ancestor
const paragraph = findParentByType(selection, schema.nodes.paragraph);
```
