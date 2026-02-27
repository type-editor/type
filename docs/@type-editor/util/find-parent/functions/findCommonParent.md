[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/util](../../README.md) / [find-parent](../README.md) / findCommonParent

# Function: findCommonParent()

```ts
function findCommonParent(selection): FindParentResult;
```

Defined in: [find-parent.ts:87](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/util/src/find-parent.ts#L87)

Finds the deepest common ancestor node that contains both ends of the selection.

For a collapsed selection or when both ends share the same parent,
returns that immediate parent. For selections spanning multiple nodes,
traverses upward to find the first ancestor that contains both endpoints.

## Parameters

| Parameter   | Type          | Description                   |
| ----------- | ------------- | ----------------------------- |
| `selection` | `PmSelection` | The current editor selection. |

## Returns

[`FindParentResult`](../../types/FindParentResult/interfaces/FindParentResult.md)

The common parent node with its resolved position, or `null` if none exists
(should only occur for invalid selections).

## Example

```typescript
// Get the container of the current selection
const container = findCommonParent(selection);
if (container) {
  console.log("Selection is within:", container.node.type.name);
}
```
