[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/util](../../README.md) / [find-parent](../README.md) / findParent

# Function: findParent()

```ts
function findParent(selection, predicate): FindParentResult;
```

Defined in: [find-parent.ts:24](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/util/src/find-parent.ts#L24)

Finds the nearest ancestor node in the document tree that satisfies the given predicate.

The search starts from the common parent of the selection and traverses upward
through the document hierarchy until a matching node is found or the root is reached.

## Parameters

| Parameter   | Type                                                                                            | Description                                                                                             |
| ----------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `selection` | `PmSelection`                                                                                   | The current editor selection to search from.                                                            |
| `predicate` | [`FindCallbackFunction`](../../types/FindCallbackFunction/type-aliases/FindCallbackFunction.md) | A callback function that tests each ancestor node. Should return `true` when the desired node is found. |

## Returns

[`FindParentResult`](../../types/FindParentResult/interfaces/FindParentResult.md)

The matching parent node with its resolved position, or `null` if no match is found.

## Example

```typescript
// Find the nearest list item ancestor
const listItem = findParent(
  selection,
  (node) => node.type.name === "list_item",
);
```
