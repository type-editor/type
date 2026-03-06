[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/dom-coords-util](../../../../README.md) / [dom-coords/util/scroll-stack](../README.md) / scrollStack

# Function: scrollStack()

```ts
function scrollStack(dom): ScrollPos[];
```

Defined in: [dom-coords/util/scroll-stack.ts:12](https://github.com/type-editor/type/blob/70862bf5e8a5266dfb443941f265014c48842b41/packages/dom-coords-util/src/dom-coords/util/scroll-stack.ts#L12)

Build a stack of scroll positions for all ancestors of the given DOM node.

## Parameters

| Parameter | Type   | Description           |
| --------- | ------ | --------------------- |
| `dom`     | `Node` | The starting DOM node |

## Returns

[`ScrollPos`](../../../../types/dom-coords/ScrollPos/interfaces/ScrollPos.md)[]

Array of scroll positions for each ancestor
